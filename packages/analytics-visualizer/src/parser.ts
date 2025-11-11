import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
import type { ActionProperty, Action, IdentifierData } from "./types.ts";

/**
 * Extracts TypeScript type as a string representation
 * @param typeNode
 * @param checker
 * @param program
 */
function getTypeString(
  typeNode: ts.TypeNode,
  checker: ts.TypeChecker,
  program?: ts.Program,
): string {
  if (ts.isLiteralTypeNode(typeNode)) {
    if (ts.isStringLiteral(typeNode.literal)) {
      return `"${typeNode.literal.text}"`;
    }
    if (ts.isNumericLiteral(typeNode.literal)) {
      return typeNode.literal.text;
    }
    if (typeNode.literal.kind === ts.SyntaxKind.TrueKeyword) {
      return "true";
    }
    if (typeNode.literal.kind === ts.SyntaxKind.FalseKeyword) {
      return "false";
    }
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    return typeNode.typeName.getText();
  }

  if (ts.isUnionTypeNode(typeNode)) {
    return typeNode.types
      .map((t) => getTypeString(t, checker, program))
      .join(" | ");
  }

  if (ts.isArrayTypeNode(typeNode)) {
    return `${getTypeString(typeNode.elementType, checker, program)}[]`;
  }

  if (ts.isTypeLiteralNode(typeNode)) {
    return "object";
  }

  return typeNode.getText();
}

/**
 * Extracts properties from an object type literal
 * @param node
 * @param checker
 * @param program
 */
function extractProperties(
  node: ts.TypeLiteralNode,
  checker: ts.TypeChecker,
  program?: ts.Program,
): ActionProperty[] {
  const properties: ActionProperty[] = [];

  for (const member of node.members) {
    if (ts.isPropertySignature(member)) {
      const name = member.name?.getText() || "";
      const optional = !!member.questionToken;

      if (member.type) {
        const typeString = getTypeString(member.type, checker, program);
        properties.push({
          name,
          type: typeString,
          optional,
        });
      } else {
        properties.push({ name, type: "any", optional });
      }
    }
  }

  return properties;
}

/**
 * Extracts actions from a union type
 * @param typeNode
 * @param checker
 * @param program
 */
function extractActions(
  typeNode: ts.TypeAliasDeclaration,
  checker: ts.TypeChecker,
  program: ts.Program,
): Action[] {
  const actions: Action[] = [];

  if (typeNode.type && ts.isUnionTypeNode(typeNode.type)) {
    for (const unionMember of typeNode.type.types) {
      if (ts.isTypeLiteralNode(unionMember)) {
        // Find the 'name' property
        const nameProperty = unionMember.members.find(
          (m) =>
            ts.isPropertySignature(m) &&
            m.name?.getText() === "name" &&
            ts.isLiteralTypeNode(m.type!) &&
            ts.isStringLiteral(m.type!.literal),
        ) as ts.PropertySignature | undefined;

        if (nameProperty) {
          const nameLiteral = (nameProperty.type as ts.LiteralTypeNode)
            .literal as ts.StringLiteral;
          const actionName = nameLiteral.text;

          // Extract all properties
          const properties = extractProperties(unionMember, checker, program);

          actions.push({
            name: actionName,
            properties: properties.filter((p) => p.name !== "name"), // Exclude 'name' from properties list
          });
        }
      }
    }
  }

  return actions;
}

/**
 * Extracts identifier from useAnalyticsRoot call
 * @param sourceFile
 */
function extractIdentifier(sourceFile: ts.SourceFile): string | null {
  let identifier: string | null = null;

  const visit = (node: ts.Node) => {
    if (ts.isCallExpression(node)) {
      // Check if it's useAnalyticsRoot - could be an identifier or property access
      const { expression } = node;
      let isUseAnalyticsRoot = false;

      if (ts.isIdentifier(expression)) {
        // Direct call: useAnalyticsRoot(...)
        isUseAnalyticsRoot = expression.getText() === "useAnalyticsRoot";
      } else if (ts.isPropertyAccessExpression(expression)) {
        // Property access: something.useAnalyticsRoot(...)
        isUseAnalyticsRoot = expression.name.getText() === "useAnalyticsRoot";
      }

      if (isUseAnalyticsRoot) {
        // Get the first argument (the identifier string)
        if (node.arguments.length > 0) {
          const arg = node.arguments[0];
          if (ts.isStringLiteral(arg)) {
            identifier = arg.text;
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return identifier;
}

/**
 * Parses a TypeScript file and extracts analytics data
 * @param filePath
 */
function parseAnalyticsFile(filePath: string): IdentifierData | null {
  try {
    // Find project root and load tsconfig
    let currentDir = path.dirname(filePath);
    let projectRoot: string | null = null;
    let tsconfigPath: string | null = null;

    while (currentDir !== path.dirname(currentDir)) {
      const potentialTsconfig = path.join(currentDir, "tsconfig.json");
      if (fs.existsSync(potentialTsconfig)) {
        tsconfigPath = potentialTsconfig;
        projectRoot = currentDir;
        break;
      }
      currentDir = path.dirname(currentDir);
    }

    if (!tsconfigPath || !projectRoot) {
      return null;
    }

    // Read and parse tsconfig.json
    const tsconfigContent = fs.readFileSync(tsconfigPath, "utf-8");
    const tsconfig = ts.parseConfigFileTextToJson(
      tsconfigPath,
      tsconfigContent,
    );

    if (tsconfig.error) {
      return null;
    }

    // Parse compiler options
    const parsedConfig = ts.parseJsonConfigFileContent(
      tsconfig.config,
      ts.sys,
      projectRoot,
    );

    const compilerOptions: ts.CompilerOptions = {
      ...parsedConfig.options,
      skipLibCheck: true,
    };

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const sourceFile = ts.createSourceFile(
      filePath,
      fileContent,
      compilerOptions.target || ts.ScriptTarget.Latest,
      true,
    );

    // Create a module resolution host
    const moduleResolutionHost: ts.ModuleResolutionHost = {
      fileExists: (fileName: string) => fs.existsSync(fileName),
      readFile: (fileName: string) => fs.readFileSync(fileName, "utf-8"),
      getCurrentDirectory: () => projectRoot!,
    };

    // Recursively collect all imported files using TypeScript's module resolution
    const filesToInclude = new Set<string>();
    const processedFiles = new Set<string>();

    const collectImportsRecursively = (filePath: string) => {
      if (processedFiles.has(filePath)) {
        return; // Avoid cycles
      }
      processedFiles.add(filePath);
      filesToInclude.add(filePath);

      if (!fs.existsSync(filePath)) {
        return;
      }

      const content = fs.readFileSync(filePath, "utf-8");
      const fileSource = ts.createSourceFile(
        filePath,
        content,
        compilerOptions.target || ts.ScriptTarget.Latest,
        true,
      );

      const visit = (node: ts.Node) => {
        // Handle both regular imports and type-only imports
        if (ts.isImportDeclaration(node)) {
          const { moduleSpecifier } = node;
          if (moduleSpecifier && ts.isStringLiteral(moduleSpecifier)) {
            const importPath = moduleSpecifier.text;

            // Skip external packages
            if (
              importPath.startsWith("@evg-ui/") ||
              importPath.startsWith("@")
            ) {
              return;
            }

            // Use TypeScript's module resolution
            const resolved = ts.resolveModuleName(
              importPath,
              filePath,
              compilerOptions,
              moduleResolutionHost,
            );

            if (
              resolved.resolvedModule &&
              resolved.resolvedModule.resolvedFileName
            ) {
              const resolvedPath = resolved.resolvedModule.resolvedFileName;

              // Only process TypeScript source files (not .d.ts or node_modules)
              if (
                resolvedPath.endsWith(".ts") ||
                resolvedPath.endsWith(".tsx")
              ) {
                // Check if it's within the src directory
                const srcDir = path.join(projectRoot!, "src");
                if (resolvedPath.startsWith(srcDir)) {
                  collectImportsRecursively(resolvedPath);
                }
              }
            }
          }
        }
        ts.forEachChild(node, visit);
      };

      visit(fileSource);
    };

    // Start collecting from the source file
    collectImportsRecursively(filePath);

    const filesArray = Array.from(filesToInclude);

    const program = ts.createProgram(filesArray, compilerOptions);
    const checker = program.getTypeChecker();

    // Find the Action type alias
    let actionTypeNode: ts.TypeAliasDeclaration | null = null;

    const visit = (node: ts.Node) => {
      if (ts.isTypeAliasDeclaration(node) && node.name.getText() === "Action") {
        actionTypeNode = node;
      }
      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    if (!actionTypeNode) {
      return null;
    }

    // Extract identifier
    const identifier = extractIdentifier(sourceFile);
    if (!identifier) {
      return null;
    }

    // Extract actions
    const actions = extractActions(actionTypeNode, checker, program);

    if (actions.length === 0) {
      return null;
    }

    return {
      identifier,
      actions,
      filePath,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Scans the analytics directory for all analytics files
 * @param analyticsDir
 */
export function scanAnalyticsDirectory(analyticsDir: string): IdentifierData[] {
  const results: IdentifierData[] = [];

  /**
   *
   * @param dir
   */
  function scanDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (
        entry.isFile() &&
        entry.name.endsWith(".ts") &&
        !entry.name.endsWith(".d.ts") &&
        entry.name !== "index.ts" &&
        entry.name !== "types.ts" &&
        entry.name !== "useAnalyticAttributes.ts"
      ) {
        const data = parseAnalyticsFile(fullPath);
        if (data) {
          results.push(data);
        }
      }
    }
  }

  scanDir(analyticsDir);
  return results;
}

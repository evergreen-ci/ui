import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
import {
  EXCLUDED_FILES,
  ACTION_TYPE_NAME,
  USE_ANALYTICS_ROOT_HOOK,
  ACTION_NAME_PROPERTY,
  TSCONFIG_FILE_NAME,
  TYPESCRIPT_SOURCE_EXTENSIONS,
} from "./constants.ts";
import type { ActionProperty, Action, IdentifierData } from "./types.ts";

/**
 * Extracts TypeScript type as a string representation
 * @param typeNode - The TypeScript type node to convert to a string
 * @returns String representation of the type
 */
const getTypeString = (typeNode: ts.TypeNode): string => {
  if (ts.isLiteralTypeNode(typeNode)) {
    if (ts.isStringLiteral(typeNode.literal)) {
      return `"${typeNode.literal.text}"`;
    }
    if (ts.isNumericLiteral(typeNode.literal)) {
      return typeNode.literal.text;
    }
    if (
      typeNode.literal.kind === ts.SyntaxKind.TrueKeyword ||
      typeNode.literal.kind === ts.SyntaxKind.FalseKeyword
    ) {
      return typeNode.literal.kind === ts.SyntaxKind.TrueKeyword
        ? "true"
        : "false";
    }
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    return typeNode.typeName.getText();
  }

  if (ts.isUnionTypeNode(typeNode)) {
    return typeNode.types.map((t) => getTypeString(t)).join(" | ");
  }

  if (ts.isArrayTypeNode(typeNode)) {
    return `${getTypeString(typeNode.elementType)}[]`;
  }

  if (ts.isTypeLiteralNode(typeNode)) {
    return "object";
  }

  return typeNode.getText();
};

/**
 * Extracts properties from an object type literal
 * @param node - The type literal node containing properties
 * @returns Array of extracted properties
 */
const extractProperties = (node: ts.TypeLiteralNode): ActionProperty[] => {
  const properties: ActionProperty[] = [];

  for (const member of node.members) {
    if (ts.isPropertySignature(member)) {
      const name = member.name?.getText() || "";
      const optional = !!member.questionToken;

      if (member.type) {
        const typeString = getTypeString(member.type);
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
};

/**
 * Extracts the action name from a type literal node
 * @param unionMember - The type literal node to search
 * @returns The action name string if found, null otherwise
 */
const extractActionName = (
  unionMember: ts.TypeLiteralNode,
): string | null => {
  for (const member of unionMember.members) {
    if (
      ts.isPropertySignature(member) &&
      member.name?.getText() === ACTION_NAME_PROPERTY &&
      member.type &&
      ts.isLiteralTypeNode(member.type) &&
      ts.isStringLiteral(member.type.literal)
    ) {
      return member.type.literal.text;
    }
  }
  return null;
};

/**
 * Extracts actions from a union type
 * @param typeNode - The type alias declaration containing the Action union type
 * @returns Array of extracted actions
 */
const extractActions = (typeNode: ts.TypeAliasDeclaration): Action[] => {
  const actions: Action[] = [];

  if (!typeNode.type || !ts.isUnionTypeNode(typeNode.type)) {
    return actions;
  }

  for (const unionMember of typeNode.type.types) {
    if (!ts.isTypeLiteralNode(unionMember)) {
      continue;
    }

    const actionName = extractActionName(unionMember);
    if (!actionName) {
      continue;
    }

    // Extract all properties
    const properties = extractProperties(unionMember);

    actions.push({
      name: actionName,
      properties: properties.filter((p) => p.name !== ACTION_NAME_PROPERTY), // Exclude 'name' from properties list
    });
  }

  return actions;
};

/**
 * Checks if a call expression is a useAnalyticsRoot call
 * @param expression - The call expression to check
 * @returns True if this is a useAnalyticsRoot call
 */
const isUseAnalyticsRootCall = (expression: ts.Expression): boolean => {
  const name = ts.isIdentifier(expression)
    ? expression.getText()
    : ts.isPropertyAccessExpression(expression)
      ? expression.name.getText()
      : null;
  return name === USE_ANALYTICS_ROOT_HOOK;
};

/**
 * Extracts identifier from useAnalyticsRoot call
 * @param sourceFile - The source file to search
 * @returns The identifier string if found, null otherwise
 */
const extractIdentifier = (sourceFile: ts.SourceFile): string | null => {
  const visit = (node: ts.Node): string | null => {
    if (ts.isCallExpression(node)) {
      if (isUseAnalyticsRootCall(node.expression)) {
        // Get the first argument (the identifier string)
        const arg = node.arguments[0];
        if (arg && ts.isStringLiteral(arg)) {
          return arg.text;
        }
      }
    }

    for (const child of node.getChildren()) {
      const result = visit(child);
      if (result) {
        return result;
      }
    }

    return null;
  };

  return visit(sourceFile);
};

/**
 * Parses a TypeScript file and extracts analytics data
 * @param filePath - Absolute path to the TypeScript file to parse
 * @returns Identifier data with actions if found, null otherwise
 */
const parseAnalyticsFile = (filePath: string): IdentifierData | null => {
  try {
    // Find project root and load tsconfig
    let currentDir = path.dirname(filePath);
    let projectRoot: string | null = null;
    let tsconfigPath: string | null = null;

    while (currentDir !== path.dirname(currentDir)) {
      const potentialTsconfig = path.join(currentDir, TSCONFIG_FILE_NAME);
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
      throw new Error(
        `Failed to parse tsconfig: ${tsconfig.error.messageText}`,
      );
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

    // Find the Action type alias
    const findActionType = (node: ts.Node): ts.TypeAliasDeclaration | null => {
      if (
        ts.isTypeAliasDeclaration(node) &&
        node.name.getText() === ACTION_TYPE_NAME
      ) {
        return node;
      }
      for (const child of node.getChildren()) {
        const result = findActionType(child);
        if (result) {
          return result;
        }
      }
      return null;
    };

    const actionTypeNode = findActionType(sourceFile);
    if (!actionTypeNode) {
      return null;
    }

    // Extract identifier
    const identifier = extractIdentifier(sourceFile);
    if (!identifier) {
      return null;
    }

    // Extract actions
    const actions = extractActions(actionTypeNode);

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
};

/**
 * Scans the analytics directory for all analytics files
 * @param analyticsDir - Path to the directory containing analytics files
 * @returns Array of identifier data extracted from all analytics files
 */
export const scanAnalyticsDirectory = (
  analyticsDir: string,
): IdentifierData[] => {
  const results: IdentifierData[] = [];

  /**
   * Recursively scans a directory for TypeScript analytics files
   * @param dir - Directory path to scan
   */
  const scanDir = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (
        entry.isFile() &&
        TYPESCRIPT_SOURCE_EXTENSIONS.some((ext) => entry.name.endsWith(ext)) &&
        !EXCLUDED_FILES.includes(entry.name as (typeof EXCLUDED_FILES)[number])
      ) {
        const data = parseAnalyticsFile(fullPath);
        if (data) {
          results.push(data);
        }
      }
    }
  };

  scanDir(analyticsDir);
  return results;
};

# vite-utils

**vite-utils** is a package that provides shared Vite utility functions and
configuration snippets.

## Overview

This package includes a collection of functions and settings that help
standardize the configuration and development workflow of Vite-based
applications. By using **vite-utils**, you can:

## Why Compilation is Required

Because Node's native ESM loader does not support TypeScript files directly, the
package must be compiled into JavaScript.

### Building the Package

After making changes to the **vite-utils** code, compile the TypeScript source
by running:

```bash
yarn compile
```

### Using vite-utils

After compilation, you can import the utilities in your Vite configuration.

```ts
import { generateBaseHTTPSViteServerConfig } from "@evg-ui/vite-utils";
```

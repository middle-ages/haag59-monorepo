# Internal Configuration Workspace

You will find here configuration files and templates for:

1. Node.js - `package.json`
1. Typescript - `tsconfig.json`
1. Vitest - `vitest.config.ts`

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [Internal Configuration Workspace](#internal-configuration-workspace)
  - [How it Works](#how-it-works)
    - [Workspace Visibility](#workspace-visibility)
    - [Workspace Environment](#workspace-environment)
    - [Typescript Natures](#typescript-natures)
  - [The Configuration](#the-configuration)
    - [Templates](#templates)
      - [1. Node.js](#1-nodejs)
      - [2. Typescript](#2-typescript)
      - [3. Vitest](#3-vitest)
    - [Shared Configuration](#shared-configuration)
      - [1. Typescript](#1-typescript)
      - [2. Vitest](#2-vitest)
  - [See Also](#see-also)

<!-- /code_chunk_output -->

## How it Works

The configuration _templates_, found in the [template](./template) folder, are meant to be copied into workspace folders and processed by scripts in the [scripts workspace](../scripts/README.md), for example [workspace-create](../scripts/bin/workspace-create).

When possible, the template configurations will delegate all configuration to the central configuration files located here at:

- [typescript](./typescript/) - these files are _extended_ by workspace typescript configuration.
- [vitest](./vitest) - these files are _imported_ by workspace vitest configuration.

`package.json` files cannot be extended in this way, which means that you will only find _templates_ for these here and no shared configuration. See [below](#1-nodejs) for treatment of `package.json` files.

### Workspace Visibility

Every workspace has a visibility of **public** or **private**. Public projects are published to `npm`.

Private workspaces are not published and only exist for the sake of other workspaces.

### Workspace Environment

Every workspace has a main environment of **node** or **browser**.

You may find configuration for more than one environment in the same workspace, as dev tools like ESLint run under **node**, regardless of the workspace main environment.

### Typescript Natures

Every Typescript source file in a workspace belongs to one of the `tsconfig` files found in the `config` folder. They are grouped by _nature_:

1. **main** - the only source code that appears in a production builds.
1. **dev** - developer tools.
1. **test** - tests and test tools.

## The Configuration

### Templates

Grouped the tool we are configuring.

#### 1. Node.js

`package.json` file are composed at _workspace create_ time from parts by visibility.  The parts are:

1. [private workspaces](./template/package-json/private.json).
1. [public workspaces](./template/package-json/public.json)
1. [common fields](./template/package-json/common.json)

#### 2. Typescript

1. [Top-level workspace configuration](./template/tsconfig.node.top.json).
   Includes no files but only references to configurations in workspace `config` folder. Copied to workspace root folder.
1. Configuration copied to workspace `config` folder:
    1. [Library/application workspace configuration](./template/tsconfig.node.main.json).
       The main configuration used to build the package. Includes the source code except for tests and other such
       non-production code. _Extends_ the [shared configuration](./typescript/tsconfig.node.main.json).
    1. [Workspace dev tools configuration](./template/tsconfig.node.dev.json).
       Used for compiling workspace Typescript configuration files, for example. _Extends_ the
       [shared configuration](./typescript/tsconfig.node.dev.json).
    1. [Workspace test configuration](./template/tsconfig.node.test.json).
       Used for running workspace test. _Extends_ the [shared configuration](./typescript/tsconfig.node.test.json).

#### 3. Vitest

1. For the [“node” environment](./template/vitest.node.config.ts).

The configuration pulls in the shared configuration from the endpoint exported from this package named `config/vitest.[ENVIRONMENT]`.

### Shared Configuration

#### 1. Typescript

1. The “node” environment
    1. [Library/application workspace configuration](./typescript/tsconfig.node.main.json).
    1. [Workspace dev tools configuration](./typescript/tsconfig.node.dev.json).
    1. [Workspace test configuration](./typescript/tsconfig.node.test.json).

#### 2. Vitest

1. The “node” environment
    1. [Vitest shared configuration](vitest/vitest.node.config.ts).

## See Also

1. [Bash scripts from scripts workspace](../scripts/bin).

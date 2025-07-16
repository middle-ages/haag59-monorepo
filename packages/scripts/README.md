# Internal Scripts Workspace

Dev scripts for repository tasks.

## Workspace Scripts

|              Name              |            About                      |
|--------------------------------|---------------------------------------|
| [`pnpm show:info`](./bin/show-info)   | Show info for current workspace.      |
| [`pnpm clean`](./bin/clean)           | Clean built+generated files.          |
| [`pnpm lint`](./bin/lint)             | Lint code+config.                     |
| [`pnpm lint:fix`](./bin/lint-fix)     | Lint code+config and fix if possible. |
| [`pnpm test`](./bin/test-run)         | Run workspace tests.                  |
| [`pnpm test:watch`](./bin/test-watch) | Run workspace tests in _watch_ mode.  |
| [`pnpm coverage`](./bin/coverage)     | Run workspace tests with coverage.    |
| [`pnpm typecheck`](./bin/typecheck)   | Check workspace types.                |
| [`pnpm build`](./bin/build)           | Compile workspace Typescript.         |

## Repository Management Scripts

|                     Name                   |                 About            |
|--------------------------------------------|----------------------------------|
| `pnpm shellcheck`                          | Shellcheck scripts.              |
| `pnpm circular`                            | Check for circular dependencies. |
| [workspace:create](./bin/workspace-create) | Create new repository workspace. |

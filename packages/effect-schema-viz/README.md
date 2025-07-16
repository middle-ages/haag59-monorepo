# `effect-schema-viz`

Visualize your Effect/Schema.

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [`effect-schema-viz`](#effect-schema-viz)
  - [Quick Start](#quick-start)
    - [1. Requirements](#1-requirements)
    - [2. Install](#2-install)
    - [3. Use From Code](#3-use-from-code)
  - [Examples](#examples)
  - [Features](#features)
  - [Limitations](#limitations)
  - [See Also](#see-also)

<!-- /code_chunk_output -->

## Quick Start

### 1. Requirements

[Effect](https://www.npmjs.com/package/effect) obviously, but you will also need
the `dot` executable from [Graphviz](https://graphviz.org) in your path to
generate images from `.dot` files.

For the _quick start example_ below you will also need `tsx`:

```sh
pnpm add -D tsx
```

### 2. Install

```sh
pnpm add -D effect-schema-viz
```

### 3. Use From Code

Create a script in your project source folder, for example `src/show-schema.ts`:

```ts
#!/usr/bin/env tsx

import {Schema, pipe} from 'effect'
import {setIdentifier, structsToDot} from 'effect-schema-viz'

// We must set an identifier on a schema before using it.
const Foo = pipe(
  {foo: Schema.String},
  Schema.Struct,
  setIdentifier('Foo'),
)

const Bar = pipe(
  {bar: Foo},
  Schema.Struct,
  setIdentifier('Bar'),
)

const dot = structsToDot('basic example')(
  Foo,
  Bar,
)

console.log(dot)
```

Run the script with:

```sh
tsx src/show-schema.ts > diagram.dot && dot -Tsvg diagram.dot > diagram.svg
```

Your SVG diagram should look like this:

![basic example](doc/examples/basic.svg)

## Examples

|                Source                              |                   Diagram             |
|----------------------------------------------------|---------------------------------------|
|[basic.ts](src/test/examples/basic.ts)              |![image](doc/examples/basic.svg)       |
|[kitchenSink.ts](src/test/examples/kitchenSink.ts)  |![image](doc/examples/kitchenSink.svg) |
|[dependencies.ts](src/test/examples/dependencies.ts)|![image](doc/examples/dependencies.svg)|

## Features

1. Render your `Effect/Schema` object types in Graphviz.
2. Render dependencies as edges.
3. Customize Graphviz node attributes per node.
4. Customize Graphviz edge attributes for all _outgoing_ edges of a node.

## Limitations

1. Without parsing the source, `effect-schema-viz` cannot know the _names_ of your `Structs`. To get useful diagrams, you should annotate your structs with the identifier annotation, using:
    1. `Effect/Schema` [identifier annotation](https://github.com/Effect-TS/effect/blob/main/packages/effect/src/SchemaAST.ts#L109)
    2. Create your structs using [Struct.named(name)({...})](https://github.com/middle-ages/haag59-monorepo/blob/main/packages/effect-schema-viz/src/schema/annotations.ts#L76).
    3. Call the function [setIdentifier](https://github.com/middle-ages/haag59-monorepo/blob/main/packages/effect-schema-viz/src/schema/annotations.ts#L44) on the `Struct`.
2. No support yet for _Records_ or _index signatures_.
3. No support for _custom declarations_.

## See Also

1. [API Documentation](https://middle-ages.github.io/effect-schema-viz-docs).
2. [`src/diagram`](src/diagram) package [type diagram](https://raw.githubusercontent.com/middle-ages/haag59-monorepo/refs/heads/main/packages/effect-schema-viz/src/diagram/doc/effect-schema-viz-diagram-model.png).
3. [graphviz-ts](https://github.com/ts-graphviz/ts-graphviz).
4. [Effect/Schema](https://effect.website/docs/schema/introduction).

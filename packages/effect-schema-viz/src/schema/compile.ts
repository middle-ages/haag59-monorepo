import type {Node} from '#model'
import {Array, Either, flow, Option, pipe, Schema, SchemaAST} from 'effect'
import type {AllSchema} from 'utilities/Schema'
import {compileClassAst, isClassAst, type ClassError} from './compile/class.js'
import * as CompileResult from './compile/result.js'
import {
  compileStructAst,
  isStructAst,
  type StructError,
} from './compile/struct.js'

export * from './compile/class.js'
export * as CompileResult from './compile/result.js'
export * from './compile/struct.js'

export interface AnyClass {
  new (...arg: never[]): unknown
}

export type AnyClassOf<
  Self extends AnyClass,
  Fields extends Schema.Struct.Fields,
> = Schema.Class<
  InstanceType<Self>,
  Fields,
  Schema.Struct.Encoded<Fields>,
  Schema.Struct.Context<Fields>,
  Schema.Struct.Constructor<Fields>,
  {},
  {}
>

export type ObjectType<
  Self extends AnyClass,
  Fields extends Schema.Struct.Fields,
> = Schema.Struct<Fields> | AnyClassOf<Self, Fields>

export type AnyObjectType<Key extends PropertyKey> = ObjectType<
  any,
  Record<Key, AllSchema>
>

/** Compile a schema `Struct` into a diagram node or an error. */
export const compileStruct = <Fields extends Schema.Struct.Fields>({
  ast,
}: Schema.Struct<Fields>): Either.Either<Node, StructError> =>
  compileStructAst(ast)

/** Compile a schema `Class` into a diagram node or an error. */
export const compileClass = <
  Self extends {new (arg: any): any},
  Fields extends Schema.Struct.Fields,
>(
  schema: AnyClassOf<Self, Fields>,
): Either.Either<Node, ClassError> => compileClassAst(schema.ast)

/**
 * Compile a schema object type, `Struct` or `Class`, into a diagram node or an
 * error.
 */
export const compileObjectType = <
  Self extends {new (arg: any): any},
  Fields extends Schema.Struct.Fields,
>({
  ast,
}: ObjectType<Self, Fields>): CompileResult.Result =>
  isStructAst(ast) ? compileStructAst(ast) : compileClassAst(ast)

/**
 * Compile a schema into an option of a diagram node or an error. If the schema
 * is not an object type, I.E: a `Struct` or `Class`, returns `none`.
 */
export const compileSchema = (
  schema: AllSchema,
): Option.Option<CompileResult.Result> =>
  pipe(
    schema.ast,
    Option.liftPredicate(isObjectTypeAst),
    Option.map(ast =>
      (isStructAst(ast) ? compileStructAst : compileClassAst)(ast),
    ),
  )

/**
 * Compile a non-empty array of mixed classes and named structs into diagram
 * nodes or a list of errors. Schemas that are not classes or structs are
 * ignored.
 * @param schemas - Non-empty mixed array of schema structs and/or schema
 * classes.
 * @returns Either a combined non-empty list of errors, a non-empty list of
 * nodes, or both if some nodes did compile and others did not. If no object
 * types were found in the given schemas, then a single `No object types found.`
 * error is returned.
 */
export const compileSchemas: (
  schemas: Array.NonEmptyReadonlyArray<AllSchema>,
) => CompileResult.Results = flow(
  Array.map(compileSchema),
  Array.getSomes,
  found =>
    Array.isNonEmptyArray(found)
      ? CompileResult.combine(found)
      : CompileResult.noObjectTypesFound,
)

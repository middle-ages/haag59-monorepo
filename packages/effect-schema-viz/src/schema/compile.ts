import type {Schema} from 'effect'
import {compileStructAst} from './compile/struct.js'

export * from './compile/class.js'
export * from './compile/struct.js'

export type AnyStructs = readonly Schema.Struct<any>[]

export const compileStruct = <Fields extends Schema.Struct.Fields>({
  ast,
}: Schema.Struct<Fields>) => compileStructAst(ast)

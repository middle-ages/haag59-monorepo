import {getIdentifierOrAnonymous, getOptions} from './annotations.js'
import {Node, PropertySignature, Reference} from '#model'
import {Array, pipe, Schema} from 'utilities'
import {compileAstReference} from './reference.js'

export type AnyStructs = readonly Schema.Struct<any>[]

export const compileStruct = <Fields extends Schema.Struct.Fields>({
  ast,
}: Schema.Struct<Fields>): Node => {
  if (ast._tag !== 'TypeLiteral') {
    throw new Error('Found Struct that is not a TypeLiteral.')
  }

  return Node(
    getIdentifierOrAnonymous(ast),
    pipe(
      ast.propertySignatures,
      Array.map(({name, type, isOptional}) =>
        PropertySignature({
          name,
          reference: pipe(
            type,
            compileAstReference,
            Reference.suffixOptionalIf(isOptional),
          ),
        }),
      ),
    ),
    ...getOptions(ast),
  )
}

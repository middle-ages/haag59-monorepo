import {Node} from '#model'
import {Data, Either, Option, pipe, type SchemaAST} from 'effect'
import {getIdentifierAnnotation} from 'effect/SchemaAST'
import {Array} from 'utilities'
import {getOptions} from '../annotations.js'
import {compilePropertySignatureAst} from './signature.js'

export const compileStructAst = (
  ast: SchemaAST.AST,
): Either.Either<Node, StructError> => {
  if (ast._tag !== 'TypeLiteral') {
    return unexpectedAst(ast)
  }

  return pipe(
    ast,
    getIdentifierAnnotation,
    Option.match({
      onNone: () => missingIdentifier(ast),
      onSome: identifier =>
        Either.right(
          Node(
            identifier,
            Array.map(ast.propertySignatures, compilePropertySignatureAst),
            ...getOptions(ast),
          ),
        ),
    }),
  )
}

const [unexpectedAst, missingIdentifier] = [
  (ast: SchemaAST.AST) => Either.left(new StructError.UnexpectedAst({ast})),
  (ast: SchemaAST.AST) => Either.left(new StructError.MissingIdentifier({ast})),
]

export namespace StructError {
  export class UnexpectedAst extends Data.TaggedError('UnexpectedAst')<{
    ast: SchemaAST.AST
  }> {}

  export class MissingIdentifier extends Data.TaggedError('MissingIdentifier')<{
    ast: SchemaAST.AST
  }> {}
}

export type StructError =
  | InstanceType<typeof StructError.UnexpectedAst>
  | InstanceType<typeof StructError.MissingIdentifier>

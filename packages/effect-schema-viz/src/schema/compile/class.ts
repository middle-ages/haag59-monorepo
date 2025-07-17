import {ClassNode, Node} from '#model'
import {Data, Either, Option, SchemaAST} from 'effect'
import {Array, pipe} from 'utilities'
import {compilePropertySignatureAst} from './signature.js'
import {getOptions} from '#annotations'

export const compileClassAst: (
  ast: SchemaAST.AST,
) => Either.Either<Node, ClassError> = ast =>
  pipe(
    ast,
    parseClassAst,
    Either.map(({name, propertySignatures}) =>
      ClassNode(
        name,
        Array.map(propertySignatures, compilePropertySignatureAst),
        ...getOptions(ast),
      ),
    ),
  )

interface Parsed {
  name: string
  propertySignatures: readonly SchemaAST.PropertySignature[]
}

const parseClassAst = (
  ast: SchemaAST.AST,
): Either.Either<Parsed, ClassError> => {
  // A class is a transform.
  if (!SchemaAST.isTransformation(ast)) {
    return incorrectTransform(ast)
  }

  // A class is a transform from a type literal to a declaration.
  const {from, to} = ast
  if (SchemaAST.isTypeLiteral(from) && SchemaAST.isDeclaration(to)) {
    const {propertySignatures} = from
    return pipe(
      to,
      SchemaAST.getIdentifierAnnotation,
      // A class will have an identifier in its declaration.
      Option.match({
        onNone: () => missingIdentifier(ast),
        onSome: name => Either.right({name, propertySignatures}),
      }),
    )
  }

  return incorrectTransform(ast)
}

const [incorrectTransform, missingIdentifier] = [
  (ast: SchemaAST.AST) => Either.left(new ClassError.IncorrectTransform({ast})),
  (ast: SchemaAST.AST) => Either.left(new ClassError.MissingIdentifier({ast})),
]

export namespace ClassError {
  export class IncorrectTransform extends Data.TaggedError(
    'IncorrectClassTransform',
  )<{
    ast: SchemaAST.AST
  }> {}

  export class MissingIdentifier extends Data.TaggedError('MissingIdentifier')<{
    ast: SchemaAST.AST
  }> {}
}

export type ClassError =
  | InstanceType<typeof ClassError.IncorrectTransform>
  | InstanceType<typeof ClassError.MissingIdentifier>

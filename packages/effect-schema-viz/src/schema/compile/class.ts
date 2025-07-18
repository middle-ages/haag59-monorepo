import {getOptions} from '#annotations'
import {ClassNode, Node} from '#model'
import {Data, Either, Option, SchemaAST} from 'effect'
import {Array, pipe} from 'utilities'
import {compilePropertySignatureAst} from './signature.js'

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
    return notAClassTransform(ast)
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

  return notAClassTransform(ast)
}

export const isClassAst = (
  ast: SchemaAST.AST,
): ast is SchemaAST.Transformation =>
  SchemaAST.isTransformation(ast) &&
  SchemaAST.isTypeLiteral(ast.from) &&
  SchemaAST.isDeclaration(ast.to)

export const [notAClassTransform, missingIdentifier] = [
  (ast: SchemaAST.AST) => Either.left(new ClassError.NotAClassTransform({ast})),
  (ast: SchemaAST.AST) => Either.left(new ClassError.MissingIdentifier({ast})),
]

export namespace ClassError {
  export class NotAClassTransform extends Data.TaggedError(
    'NotAClassTransform',
  )<{
    ast: SchemaAST.AST
  }> {}

  export class MissingIdentifier extends Data.TaggedError('MissingIdentifier')<{
    ast: SchemaAST.AST
  }> {}
}

export type ClassError =
  | InstanceType<typeof ClassError.NotAClassTransform>
  | InstanceType<typeof ClassError.MissingIdentifier>

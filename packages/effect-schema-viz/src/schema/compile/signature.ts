import {PropertySignature, Reference} from '#model'
import {SchemaAST} from 'effect'
import {pipe} from 'utilities'
import {compileAstReference} from './reference.js'

export const compilePropertySignatureAst = ({
  name,
  type,
  isOptional,
}: SchemaAST.PropertySignature): PropertySignature =>
  PropertySignature({
    name,
    reference: pipe(
      type,
      compileAstReference,
      Reference.suffixOptionalIf(isOptional),
    ),
  })

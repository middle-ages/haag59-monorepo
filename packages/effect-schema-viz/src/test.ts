import {Either, flow, type SchemaAST} from 'effect'
import {compileStructAst} from '#compile'
import {pluck} from '#util'

export const errorType: (ast: SchemaAST.AST) => string = flow(
  compileStructAst,
  Either.match({
    onLeft: pluck('_tag'),
    onRight: () => 'false negative',
  }),
)

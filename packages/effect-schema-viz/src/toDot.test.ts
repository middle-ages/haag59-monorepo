import {Struct} from '#annotations'
import {Schema} from 'effect'
import {schemasToDot} from './toDot.js'

const iut = schemasToDot('diagram')

const NamedStructSchema = Struct.styled('NamedStruct', {label: 'NamedStruct'})({
  name: Schema.String,
})

class ClassSchema extends Schema.Class<ClassSchema>('ClassSchema')({
  id: Schema.Number,
}) {}

const AnonymousStructSchema = Schema.Struct({anonymous: Schema.Number})

describe('schemasToDot', () => {
  test('Named struct', () => {
    expect(iut(NamedStructSchema)).toBe(`digraph "diagram" {
  "NamedStruct" [
    label = "NamedStruct";
  ];
}`)
  })

  test('Class', () => {
    expect(iut(ClassSchema)).toBe(`digraph "diagram" {
  "ClassSchema" [
    label = <<table border="0" cellborder="0" cellspacing="4">
<tr><td colspan="2" border="1" sides="b">ClassSchema</td></tr>
<tr>
<td border="0" cellpadding="1" align="left">id:</td>
<td border="0" cellpadding="1" align="left">number</td>
</tr>
</table>>;
  ];
}`)
  })

  test('Named struct and class', () => {
    expect(iut(NamedStructSchema, ClassSchema)).toBe(`digraph "diagram" {
  "NamedStruct" [
    label = "NamedStruct";
  ];
  "ClassSchema" [
    label = <<table border="0" cellborder="0" cellspacing="4">
<tr><td colspan="2" border="1" sides="b">ClassSchema</td></tr>
<tr>
<td border="0" cellpadding="1" align="left">id:</td>
<td border="0" cellpadding="1" align="left">number</td>
</tr>
</table>>;
  ];
}`)
  })

  test('No object types', () => {
    expect(iut(Schema.Number, Schema.String)).toBe(`digraph "diagram" {
  "ERROR: no object types found" [
    label = "ERROR: no object types found";
    color = "red";
    shape = "box";
  ];
}`)
  })

  test('Anonymous struct', () => {
    expect(iut(AnonymousStructSchema)).toBe(`digraph "diagram" {
  "ERROR: missing identifier" [
    label = "ERROR: missing identifier";
    color = "red";
    shape = "box";
  ];
}`)
  })

  test('Anonymous + named structs', () => {
    expect(iut(AnonymousStructSchema, NamedStructSchema))
      .toBe(`digraph "diagram" {
  "NamedStruct" [
    label = "NamedStruct";
  ];
  "ERROR: missing identifier" [
    label = "ERROR: missing identifier";
    color = "red";
    shape = "box";
  ];
}`)
  })
})

import {type Pair} from '#util'
import {Semigroup as SE} from '@effect/typeclass'
import {SemigroupEvery} from '@effect/typeclass/data/Boolean'
import {SemigroupSum} from '@effect/typeclass/data/Number'
import {getOptionalMonoid} from '@effect/typeclass/data/Option'
import {Semigroup as StringSemigroup} from '@effect/typeclass/data/String'
import {
  Array,
  Boolean,
  Function,
  Option as OP,
  String,
  Tuple,
  flow,
} from 'effect'
import {pair} from 'effect-ts-folds'
import {
  Law,
  type Mono,
  associativity,
  inverse,
  lawTests,
  monoEquivalence,
  monoMonoid,
  monoOrder,
  option,
  tinyArray,
  tinyString,
} from 'effect-ts-laws'
import {testTypeclassLaws, verboseLawSets} from 'effect-ts-laws/vitest'
import {left as eitherLeft, right as eitherRight} from 'effect/Either'
import {type Equivalence} from 'effect/Equivalence'
import {type Option, none, some} from 'effect/Option'
import fc from 'fast-check'
import * as EOB from '../These.js'
import {
  Both,
  Left,
  Right,
  type These,
  addLeft,
  addRight,
  getArrayArbitrary,
  getSemigroup,
  join,
  leftOption,
  onlyBoth,
  onlyLeft,
  onlyOne,
  onlyRight,
  pad,
  rightOption,
  setLeft,
  setRight,
  swap,
  unzipArray,
  zipArrays,
} from '../These.js'

describe('These', () => {
  describe('laws', () => {
    type Iut = These<Mono, Option<boolean>>

    const [OptionEquivalence, OptionOrder, OptionArbitrary, OptionSemigroup] = [
      OP.getEquivalence(Boolean.Equivalence),
      OP.getOrder(Boolean.Order),
      option(fc.boolean()),
      getOptionalMonoid(SemigroupEvery),
    ]

    const [getEquivalence, getOrder, getArbitrary] = [
      EOB.getEquivalence(OptionEquivalence),
      EOB.getOrder(OptionOrder),
      EOB.getArbitrary(OptionArbitrary),
    ]

    const Equivalence: Equivalence<Iut> = getEquivalence(monoEquivalence)

    const Semigroup: SE.Semigroup<Iut> =
      getSemigroup(OptionSemigroup)(monoMonoid)

    testTypeclassLaws<EOB.TheseTypeLambda, never, unknown, Option<boolean>>({
      getEquivalence,
      getArbitrary,
    })({
      Bicovariant: EOB.Bicovariant,
      Equivalence,
      Order: getOrder(monoOrder),
      Semigroup,
    })

    {
      const a = tinyArray(tinyString),
        xs: fc.Arbitrary<These<string, string>[]> =
          getArrayArbitrary(tinyString)(tinyString)

      const stringListEquals = Array.getEquivalence(String.Equivalence)

      const stringListPairEquals: Equivalence<Pair<string[]>> =
        Tuple.getEquivalence(stringListEquals, stringListEquals)

      const theseListEquals: Equivalence<These<string, string>[]> =
        Array.getEquivalence(
          EOB.getEquivalence(String.Equivalence)(String.Equivalence),
        )

      verboseLawSets([
        lawTests(
          'laws for zipArrays/unzipArray',

          associativity<string[]>(
            {
              a,
              f: flow(zipArrays<string, string>, concat),
              equals: stringListEquals,
            },
            'zipArrays(a, zipArrays(b, c)) = zipArrays(zipArrays(a, b), c)',
            'zipArrays associativity',
          ),
          inverse<These<string, string>[], Pair<string[]>>(
            {
              a: xs,
              f: unzipArray,
              g: Function.tupled(zipArrays<string, string>),
              equals: theseListEquals,
            },
            'unzipArray ∘ zipArrays = id',
            'zip/unzip cancellation',
          ),

          Law(
            'zip/unzip cancellation',
            'unzipArray ∘ zipArrays = id',
            a,
            a,
          )((a, b) =>
            stringListPairEquals(unzipArray(zipArrays(a, b)), pair(a, b)),
          ),

          Law(
            'unzip/zip cancellation',
            'zipArrays ∘ unzipArray = id',
            xs,
          )(ab => theseListEquals(zipArrays(...unzipArray(ab)), ab)),
        ),
      ])
    }
  })

  describe('ops', () => {
    const testOp = <A>(
      name: string,
      f: (eob: These<number, string>) => A,
      [expectedLeft, expectedRight, expectedBoth]: [A, A, A],
    ) =>
      describe(name, () => {
        test('left', () => {
          expect(f(Left.from(42))).toEqual(expectedLeft)
        })
        test('right', () => {
          expect(f(Right.from('foo'))).toEqual(expectedRight)
        })
        test('both', () => {
          expect(f(Both.from(42, 'foo'))).toEqual(expectedBoth)
        })
      })

    testOp('leftOption', leftOption, [some(42), none(), some(42)])

    testOp('rightOption', rightOption, [none(), some('foo'), some('foo')])

    testOp('onlyOne', onlyOne<number, string>, [
      some(eitherLeft(42)),
      some(eitherRight('foo')),
      none(),
    ])

    testOp('onlyLeft', onlyLeft, [some(42), none(), none()])
    testOp('onlyRight', onlyRight, [none(), some('foo'), none()])
    testOp('onlyBoth', onlyBoth, [none(), none(), some([42, 'foo'])])

    testOp<These<string, number>>('swap', swap, [
      Right({right: 42}),
      Left({left: 'foo'}),
      Both({left: 'foo', right: 42}),
    ])

    testOp<[Option<number>, Option<string>]>('pad', pad, [
      [some(42), none()],
      [none(), some('foo')],
      [some(42), some('foo')],
    ])

    testOp<These<number, string>>('addRight', addRight(StringSemigroup)('X'), [
      Both.from(42, 'X'),
      Right.from('fooX'),
      Both.from(42, 'fooX'),
    ])

    testOp<These<number, string>>('addLeft', addLeft(SemigroupSum)(1), [
      Left.from(43),
      Both.from(1, 'foo'),
      Both.from(43, 'foo'),
    ])

    testOp<These<boolean, string>>('setLeft', setLeft(true), [
      Left.from(true),
      Both.from(true, 'foo'),
      Both.from(true, 'foo'),
    ])

    testOp<These<number, boolean>>('setRight', setRight(true), [
      Both.from(42, true),
      Right.from(true),
      Both.from(42, true),
    ])

    describe('zip arrays', () => {
      test('same length', () => {
        expect(zipArrays([1, 2, 3], ['a', 'b', 'c'])).toEqual([
          Both.from(1, 'a'),
          Both.from(2, 'b'),
          Both.from(3, 'c'),
        ])
      })

      test('left longer', () => {
        expect(zipArrays([1, 2, 3, 4], ['a', 'b'])).toEqual([
          Both.from(1, 'a'),
          Both.from(2, 'b'),
          Left.from(3),
          Left.from(4),
        ])
      })

      test('right longer', () => {
        expect(zipArrays([1, 2], ['a', 'b', 'c', 'd'])).toEqual([
          Both.from(1, 'a'),
          Both.from(2, 'b'),
          Right.from('c'),
          Right.from('d'),
        ])
      })

      test('both empty', () => {
        expect(zipArrays([], [])).toEqual([])
      })

      test('right empty', () => {
        expect(zipArrays([1, 2, 3], [])).toEqual([
          Left.from(1),
          Left.from(2),
          Left.from(3),
        ])
      })

      test('left empty', () => {
        expect(zipArrays([], ['a', 'b', 'c'])).toEqual([
          Right.from('a'),
          Right.from('b'),
          Right.from('c'),
        ])
      })
    })
  })
})

const concat: (xs: These<string, string>[]) => string[] = Array.map(
  join(StringSemigroup),
)

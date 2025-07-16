import {apply0} from './Function.js'

describe('Function', () => {
  test('apply0', () => {
    expect(apply0(() => 123)).toBe(123)
  })
})

import { timeConvert } from './timeConvert'
import { expect, test, describe } from '@jest/globals'

describe('timeConvert', () => {
  test('Корректное значение, параметр как число', () => {
    expect(timeConvert(1687969409511)).toBe('19:23 - 28.06.2023')
  })
  test('Корректное значение, параметр как дата', () => {
    expect(timeConvert(new Date(2004, 11, 21))).toBe('00:00 - 21.12.2004')
  })
  test('Не корректное значение', () => {
    expect(timeConvert('1687967409511')).toBe('')
  })
})

import { colorChange } from './colorChange'
import { expect, test, describe } from '@jest/globals'

describe('colorChange', () => {
  test('Корректное значение, число как 2 параметр', () => {
    expect(colorChange('purple.700', 100)).toBe('purple.100')
  })
  test('Корректное значение, строка как 2 параметр', () => {
    expect(colorChange('gray.400', 50)).toBe('gray.50')
  })
  test('Возвращает без изменений', () => {
    expect(colorChange('dark', 500)).toBe('dark')
  })
  test('Возвращает без изменений, с равными значениями', () => {
    expect(colorChange('gray.300', 300)).toBe('gray.300')
  })
})

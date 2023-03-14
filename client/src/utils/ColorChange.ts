//Меняет цвета chakra ui Например purple.700 это color и 400 number функция возращает purple.400

export const colorChange = (color: string, number: number | string) => {
  if (!color.includes('.')) return color
  const colorShade = color.split('.')
  colorShade[1] = number.toString()
  return colorShade.join('.')
}

import { type FC } from 'react'
import Snowfall, { type SnowfallProps } from 'react-snowfall'
import { useSnowContext } from '../store'
import type { Color, RGBColor } from 'react-color'

const isRgbaColor = (color: Color): color is RGBColor => {
  return typeof color === 'object' && (color as RGBColor).r !== undefined
}

export const SnowBackground: FC<SnowfallProps> = (props) => {
  const { color, isEnabled } = useSnowContext()
  if (isEnabled && isRgbaColor(color)) {
    return (
      <Snowfall
        color={`rgba(${color.r},${color.g},${color.b},${color.a})`}
        {...props}
      />
    )
  } else {
    return <></>
  }
}

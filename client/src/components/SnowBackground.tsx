import { type FC } from 'react'
import Snowfall, { type SnowfallProps } from 'react-snowfall'
import type { Color, RGBColor } from 'react-color'
import { useSnowContext } from '../store'

const isRgbaColor = (color: Color): color is RGBColor => {
  return typeof color === 'object' && (color as RGBColor).r !== undefined
}

export const SnowBackground: FC<SnowfallProps> = (props) => {
  const { color, isEnabled, speed } = useSnowContext()

  if (isEnabled && isRgbaColor(color)) {
    return (
      <Snowfall
        speed={speed}
        color={`rgba(${color.r},${color.g},${color.b},${color.a})`}
        {...props}
      />
    )
  } else {
    return <></>
  }
}

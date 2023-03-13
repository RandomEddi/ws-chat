import { FC } from 'react'
import Snowfall, { SnowfallProps } from 'react-snowfall'
import { useSnowContext } from '../store'

export const SnowBackground: FC<SnowfallProps> = (props) => {
  const { color, isEnabled } = useSnowContext()
  if (isEnabled) {
    //@ts-ignore
    return  <Snowfall color={`rgba(${color.r},${color.g},${color.b},${color.a})`} {...props} />
  } else {
    return <></>
  }
}

import { FC, useState } from 'react'
import {
  Button,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
  Flex,
  Heading,
  Tooltip,
  Grid,
  Switch,
  Input
} from '@chakra-ui/react'
import { SettingsIcon, CloseIcon } from '@chakra-ui/icons'
import { HuePicker, AlphaPicker, Color } from 'react-color'

const THEMES: [string, string][] = [
  ['purple', 'purple.700'],
  ['blue', 'blue.700'],
  ['green', 'green.700'],
  ['gray', 'gray.700'],
  ['orange', 'orange.700'],
  ['red', 'red.700']
]

export const ThemeSettings: FC = () => {
  const { isOpen, onToggle, onClose } = useDisclosure()
  const [isSnowEnabled, setIsSnowEnabled] = useState(true)
  const [snowColor, setSnowColor] = useState<Color>('#ffffff')

  return (
    <Box zIndex={100} position={'fixed'} top={'4'} right={'4'}>
      <Popover isOpen={isOpen} onClose={onClose}>
        <PopoverTrigger>
          <Button
            w={8}
            background={'inherit'}
            _hover={{}}
            _active={{}}
            onClick={onToggle}
            cursor={'pointer'}
          >
            {isOpen ? (
              <CloseIcon color={'purple.900'} boxSize={'7'} />
            ) : (
              <SettingsIcon color={'purple.900'} boxSize={'8'} />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent py={'2'} mr={'2'} w={'60'}>
          <Flex flexDirection={'column'}>
            <Heading
              lineHeight={'7'}
              mb={'2'}
              textAlign={'center'}
              fontSize={'3xl'}
            >
              theme
            </Heading>
            <Grid
              rowGap={'3'}
              templateColumns={'repeat(3, 1fr)'}
              flexWrap={'wrap'}
              px={'2'}
            >
              {THEMES.map((theme) => (
                <Flex justifyContent={'center'} key={theme[0]}>
                  <Tooltip
                    borderRadius={'4px'}
                    label={theme[0]}
                    fontSize={'md'}
                    bg={theme[1]}
                    color={'white'}
                  >
                    <Button _hover={{}} _active={{}} bg={theme[1]} />
                  </Tooltip>
                </Flex>
              ))}
            </Grid>
          </Flex>
          <Flex flexDirection={'column'}>
            <Heading
              lineHeight={'7'}
              my={'2'}
              textAlign={'center'}
              fontSize={'3xl'}
            >
              snow
            </Heading>
            <Flex
              flexDirection={'column'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Switch
                checked={isSnowEnabled}
                onChange={(e) => setIsSnowEnabled(e.target.checked)}
              />
              {/* TODO: Доделать*/}
              <HuePicker
                color={snowColor}
                onChange={(color) => setSnowColor(color.rgb)}
                width={`${60 * 4}px`}
              />
              <AlphaPicker
                color={snowColor}
                onChange={(color) => setSnowColor(color.rgb)}
                width={`${60 * 4}px`}
              />
            </Flex>
          </Flex>
        </PopoverContent>
      </Popover>
    </Box>
  )
}

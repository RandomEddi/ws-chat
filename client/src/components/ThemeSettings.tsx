import { type FC } from 'react'
import { HuePicker, AlphaPicker } from 'react-color'
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
  Flex,
  Heading,
  Tooltip,
  Grid,
  Switch,
  useColorMode,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box
} from '@chakra-ui/react'
import { SettingsIcon, CloseIcon } from '@chakra-ui/icons'
import { useSnowContext } from '../store'

const THEMES: Record<string, string> = {
  purple: 'purple.700',
  blue: 'blue.700',
  green: 'green.700',
  gray: 'gray.600',
  orange: 'orange.700',
  red: 'red.700'
}

export const ThemeSettings: FC = () => {
  const { isOpen, onToggle, onClose } = useDisclosure()
  const { setColorMode, colorMode } = useColorMode()
  const snowContext = useSnowContext()

  return (
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
            <CloseIcon
              color={colorMode === 'light' ? 'gray.800' : 'white'}
              boxSize={'7'}
            />
          ) : (
            <SettingsIcon
              color={colorMode === 'light' ? 'gray.800' : 'white'}
              boxSize={'8'}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        bgColor={
          colorMode === 'dark'
            ? 'white'
            : colorMode === 'light'
            ? 'gray.800'
            : 'white'
        }
        py={'2'}
        mr={'2'}
        w={'60'}
      >
        <Flex flexDirection={'column'}>
          <Heading
            color={colorMode === 'light' ? 'white' : 'black'}
            lineHeight={'7'}
            mb={'2'}
            textAlign={'center'}
            fontSize={'3xl'}
          >
            theme
          </Heading>
          <Grid rowGap={'3'} templateColumns={'repeat(3, 1fr)'} px={'2'}>
            {Object.keys(THEMES).map((theme) => (
              <Flex justifyContent={'center'} key={theme}>
                <Tooltip
                  borderRadius={'4px'}
                  label={theme}
                  fontSize={'md'}
                  bg={THEMES[theme]}
                  color={'white'}
                >
                  <Button
                    onClick={() => setColorMode(THEMES[theme])}
                    _hover={{}}
                    _active={{}}
                    bg={THEMES[theme]}
                  />
                </Tooltip>
              </Flex>
            ))}
          </Grid>
          <Grid mt={4} rowGap={'3'} templateColumns={'repeat(2, 1fr)'} px={'2'}>
            <Flex justifyContent={'center'}>
              <Tooltip
                borderRadius={'4px'}
                label={'dark'}
                fontSize={'md'}
                bg={colorMode === 'light' ? 'white' : 'black'}
                color={colorMode === 'light' ? 'black' : 'white'}
              >
                <Button
                  onClick={() => setColorMode('dark')}
                  _hover={{}}
                  _active={{}}
                  bg={'black'}
                />
              </Tooltip>
            </Flex>
            <Flex justifyContent={'center'}>
              <Tooltip
                borderRadius={'4px'}
                label={'light'}
                fontSize={'md'}
                bg={colorMode === 'light' ? 'black' : 'white'}
                color={colorMode === 'light' ? 'white' : 'black'}
              >
                <Button
                  onClick={() => setColorMode('light')}
                  _hover={{}}
                  _active={{}}
                  bg={'lightyellow'}
                />
              </Tooltip>
            </Flex>
          </Grid>
        </Flex>
        <Flex flexDirection={'column'}>
          <Heading
            color={colorMode === 'light' ? 'white' : 'black'}
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
              isChecked={snowContext.isEnabled}
              onChange={(e) => snowContext.onSnowToggle(e.target.checked)}
            />
            <HuePicker
              styles={{ default: { picker: { margin: '10px 0' } } }}
              color={snowContext.color}
              onChange={snowContext.onColorSnowChange}
              width={`${55 * 4}px`}
            />
            <AlphaPicker
              color={snowContext.color}
              onChange={snowContext.onColorSnowChange}
              width={`${55 * 4}px`}
            />
          </Flex>
        </Flex>
        <Box>
          <Heading
            color={colorMode === 'light' ? 'white' : 'black'}
            lineHeight={'7'}
            my={'2'}
            textAlign={'center'}
            fontSize={'3xl'}
          >
            snow speed
          </Heading>
          <Flex w={'100%'} justifyContent={'center'}>
            <Slider
              value={snowContext.speed[0]}
              min={1}
              max={20}
              step={0.5}
              orientation='vertical'
              minH='32'
              onChange={(value) => {
                snowContext.onSpeedSnowChange(value, undefined)
              }}
            >
              <SliderTrack
                bgColor={colorMode === 'dark' ? 'gray.100' : undefined}
                w={3}
              >
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb w={5} />
            </Slider>
            <Slider
              value={snowContext.speed[1]}
              min={1}
              max={20}
              step={0.5}
              orientation='vertical'
              minH='32'
              onChange={(value) => {
                snowContext.onSpeedSnowChange(undefined, value)
              }}
            >
              <SliderTrack
                bgColor={colorMode === 'dark' ? 'gray.100' : undefined}
                w={3}
              >
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb w={5} />
            </Slider>
          </Flex>
        </Box>
      </PopoverContent>
    </Popover>
  )
}

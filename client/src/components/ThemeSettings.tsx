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
  useColorMode
} from '@chakra-ui/react'
import { SettingsIcon, CloseIcon } from '@chakra-ui/icons'
import { useSnowContext } from '../store'

const THEMES: Record<string, string> = {
  purple: 'purple.700',
  blue: 'blue.700',
  green: 'green.700',
  gray: 'gray.700',
  orange: 'orange.700',
  red: 'red.700'
}

export const ThemeSettings: FC = () => {
  const { isOpen, onToggle, onClose } = useDisclosure()
  const { setColorMode } = useColorMode()
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
            <CloseIcon color={'white'} boxSize={'7'} />
          ) : (
            <SettingsIcon color={'white'} boxSize={'8'} />
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
      </PopoverContent>
    </Popover>
  )
}

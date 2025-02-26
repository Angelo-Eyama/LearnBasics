import { Flex, Box, Link, Button } from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from './ui/color-mode';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const NavHeader = () => {
const { colorMode, toggleColorMode } = useColorMode();
const bgColor = useColorModeValue('gray.100', 'gray.900');
const color = useColorModeValue('black', 'white');

return (
    <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        bg={bgColor}
        color={color}
        className="shadow-md"
    >
    <Box>
        <Link href="/" className="text-xl font-bold">
        MiLogo
        </Link>
    </Box>

    <Box display="flex" alignItems="center">
        <Link href="/about" className="mr-4">
        Sobre Nosotros
        </Link>
        <Link href="/services" className="mr-4">
        Servicios
        </Link>
        <Link href="/contact" className="mr-4">
        Contacto
        </Link>
        <Button onClick={toggleColorMode} className="ml-4">
        {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
    </Box>
    </Flex>
);
};

export default NavHeader;
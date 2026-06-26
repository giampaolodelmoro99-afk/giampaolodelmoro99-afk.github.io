import { Flex, Box, Text } from "@chakra-ui/react";

import MobileMenu from "./MobileMenu";
import NavLink from "./NavLink";
import ActionButton from "./ActionButton";
import { navLinks, mainLink } from "./navLinks";

const name = "<GDM/>";

function Navbar() {
    return (
        <Flex
            as="nav"
            className="main-menu"
            aria-label="Navigazione-principale"
            height={{ base: "70px", md: "88px" }}
            padding={{ base: "15px 20px", md: "20px 40px" }}
            align="center"
            justify="space-between"
            borderBottom="1px solid #00FF41"
        >
            <Box>
                <Text
                    fontSize={{ base: "2xl", md: "4xl" }}
                    fontWeight="bold"
                    letterSpacing="tight"
                    fontFamily="monospace"
                    color="#00FF41"
                >
                    {name}
                </Text>
            </Box>

            <Flex display={{ base: "none", md: "flex" }} gap="30px" align="center">
                {navLinks.map((link) => (
                    <NavLink key={link.href} href={link.href}>
                        {link.label}
                    </NavLink>
                ))}
                <ActionButton href={mainLink.href}>{mainLink.label}</ActionButton>
            </Flex>

            <MobileMenu />
        </Flex>
    );
}

export default Navbar;

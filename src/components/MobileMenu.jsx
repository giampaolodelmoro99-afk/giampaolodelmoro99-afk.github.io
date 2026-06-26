import { Box, Button, Link } from "@chakra-ui/react";
import { MenuRoot, MenuTrigger, MenuContent, MenuItem } from "./ui/menu";
import { navLinks, mainLink } from "./navLinks";

const allLinks = [...navLinks, mainLink];

function MobileMenu() {
    return (
        <Box display={{ base: "block", md: "none" }}>
            <MenuRoot>
                <MenuTrigger asChild>
                    <Button
                        aria-label="Apri menu"
                        variant="outline"
                        size="sm"
                        color="#00FF41"
                        borderColor="#00FF41"
                        fontFamily="monospace"
                    >
                        ☰
                    </Button>
                </MenuTrigger>
                <MenuContent bg="black" border="1px solid #00FF41">
                    {allLinks.map((link) => (
                        <MenuItem key={link.href} value={link.label.toLowerCase()} asChild>
                            <Link href={link.href} color="#00FF41" fontFamily="monospace">
                                {link.label}
                            </Link>
                        </MenuItem>
                    ))}
                </MenuContent>
            </MenuRoot>
        </Box>
    );
}

export default MobileMenu;

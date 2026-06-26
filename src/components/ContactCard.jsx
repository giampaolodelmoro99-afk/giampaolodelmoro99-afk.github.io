import { Box, Text } from "@chakra-ui/react";
import NavLink from "./NavLink";

function ContactCard({ label, value, href, icon }) {
    return (
        <Box textAlign="center">
            <Text fontFamily="monospace" fontSize="sm" color="#a0a0a0" mb="2">
                {label}
            </Text>

            <Box whiteSpace="nowrap">
                <NavLink
                    href={href}
                    target={icon === "github" ? "_blank" : undefined}
                    rel={icon === "github" ? "noopener noreferrer" : undefined}
                >
                    {value}
                </NavLink>
            </Box>
        </Box>
    );
}

export default ContactCard;

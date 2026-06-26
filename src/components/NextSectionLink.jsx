import { Box } from "@chakra-ui/react";
import NavLink from "./NavLink";

function NextSectionLink({ href, label }) {
    return (
        <Box mt="16" textAlign="center">
            <NavLink href={href}>{label} ↓</NavLink>
        </Box>
    );
}

export default NextSectionLink;

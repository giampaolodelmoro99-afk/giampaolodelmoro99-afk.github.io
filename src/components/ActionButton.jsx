import { Button } from "@chakra-ui/react";

function ActionButton({ children, href, size = "xl", px = "32px", py = "24px", ...linkProps }) {
    return (
        <Button
            asChild
            size={size}
            fontSize="xl"
            colorPalette="green"
            variant="outline"
            borderRadius="full"
            fontFamily="monospace"
            px={px}
            py={py}
            color="#00FF41"
            transition="all 0.3s ease-in-out"
            _hover={{
                bg: "#00FF41",
                color: "black",
            }}
        >
            <a href={href} {...linkProps}>
                {children}
            </a>
        </Button>
    );
}

export default ActionButton;

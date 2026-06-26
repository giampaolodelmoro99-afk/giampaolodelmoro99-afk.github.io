import { Box } from "@chakra-ui/react";

function SectionWrapper({ children, id, fullHeight = true, pt, align = "center", maxW = "800px" }) {
    const minH = align === "flex-start"
        ? { base: "85dvh", md: "85dvh" }
        : fullHeight
            ? "100dvh"
            : { base: "calc(100dvh - 70px)", md: "calc(68dvh - 88px)" };

    return (
        <Box
            as="section"
            id={id}
            minHeight={minH}
            display="flex"
            flexDirection="column"
            justifyContent={align}
            alignItems="center"
            textAlign="center"
            maxW={maxW}
            mx="auto"
            py={{ base: "40px", md: "100px" }}
            px={{ base: "20px", md: "0px" }}
            pt={pt}
            color="#e0e0e0"
        >
            {children}
        </Box>
    );
}

export default SectionWrapper;

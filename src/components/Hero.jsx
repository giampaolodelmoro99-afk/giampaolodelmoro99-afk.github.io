import { Box, Text } from "@chakra-ui/react";
import SectionWrapper from "./SectionWrapper";

const maxim = "while(true) { sudo apt install -y coffee ☕; code(); 💻 }";

function Hero() {
    return (
        <SectionWrapper fullHeight={false} pt={{ base: "70px", md: "150px" }}>
            <Box as="h1" m="0" fontWeight="bold">
                <Text
                    as="a"
                    href="#home"
                    onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        window.history.pushState(null, "", "#home");
                    }}
                    display="block"
                    fontSize={{ base: "5xl", md: "8xl" }}
                    fontWeight="bold"
                    color="#00FF41"
                    mb="6"
                    letterSpacing="tight"
                    textDecoration="none"
                    cursor="pointer"
                    transition="opacity 0.2s ease-in-out"
                    _hover={{ opacity: 0.8 }}
                >
                    Gianpaolo
                    <Box as="span" display="block">Del Moro</Box>
                </Text>
            </Box>

            <Text
                as="code"
                display="inline-block"
                bg="#111"
                p="4"
                borderRadius="md"
                border="1px solid #333"
                fontSize={{ base: "sm", md: "md" }}
                fontFamily="monospace"
                color="#00FF41"
                mb="8"
            >
                {maxim}
            </Text>

            <Text
                as="h2"
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="medium"
                fontFamily="monospace"
                color="#a0a0a0"
            >
                Studente ITS Full Stack Developer
                <Box as="span" display="block">in cerca di una prima esperienza</Box>
            </Text>
        </SectionWrapper>
    );
}

export default Hero;

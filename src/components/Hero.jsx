import { Box, Text } from "@chakra-ui/react";
import SectionWrapper from "./SectionWrapper";

const maxim = "while(true) { sudo apt install -y coffee ☕; code(); 💻 }";

function Hero() {
    return (
        <SectionWrapper id="home" fullHeight={false} pt={{ base: "40px", md: "150px" }}>
            <Text
                as="h1"
                fontSize={{ base: "4xl", md: "8xl" }}
                fontWeight="bold"
                color="#00FF41"
                mb="6"
                letterSpacing="tight"
            >
                Gianpaolo
                <Box as="span" display="block">Del Moro</Box>
            </Text>

            <Text
                as="code"
                display="inline-block"
                bg="#111"
                p={{ base: "3", md: "4" }}
                borderRadius="md"
                border="1px solid #333"
                fontSize={{ base: "xs", md: "md" }}
                fontFamily="monospace"
                color="#00FF41"
                mb={{ base: "4", md: "8" }}
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
                <Box as="span" display="block">in cerca di una prima esperienza lavorativa</Box>
            </Text>
        </SectionWrapper>
    );
}

export default Hero;

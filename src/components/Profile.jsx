import { Text, HStack, Box } from "@chakra-ui/react";
import SectionWrapper from "./SectionWrapper";
import SectionHeading from "./SectionHeading";
import ActionButton from "./ActionButton";
import NextSectionLink from "./NextSectionLink";

function Profile() {
    return (
        <SectionWrapper id="profilo" align="flex-start" pt={{ base: "100px", md: "180px" }}>
            <HStack
                flexDirection={{ base: "column", md: "row" }}
                justify="center"
                align="center"
                gap={{ base: "4", md: "8" }}
                mb="6"
            >
                <SectionHeading>Profilo 👨‍💻🌐🚀</SectionHeading>

                <Box mt="-3">
                    <ActionButton
                        href="/cv.pdf"
                        rel="noopener noreferrer"
                        target="_blank"
                        download="Gianpaolo_Del_Moro_CV.pdf"
                    >
                        Scarica CV
                    </ActionButton>
                </Box>
            </HStack>

            <Text fontSize={{ base: "sm", md: "lg" }} textAlign="center" lineHeight="tall" fontFamily="monospace">
                Diplomato al Liceo Scientifico Buonarroti di Pisa con indirizzo Scienze Applicate, ho trasformato la mia passione per l'informatica in una percorso concreto, frequentando il corso ITS Full Stack Developer di Pisa.
                <br /><br />
                La programmazione web è il mio ambiente: amo la complessità che sta dietro ogni riga di codice. Sono in costante evoluzione, sempre alla ricerca di nuove tecnologie da padroneggiare.
            </Text>

            <NextSectionLink href="#skill" label="Vai a Skills" />
        </SectionWrapper>
    );
}

export default Profile;

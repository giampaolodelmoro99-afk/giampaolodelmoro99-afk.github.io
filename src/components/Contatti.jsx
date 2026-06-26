import { Stack, Box } from "@chakra-ui/react";
import SectionWrapper from "./SectionWrapper";
import SectionHeading from "./SectionHeading";
import ContactCard from "./ContactCard";
import ActionButton from "./ActionButton";
import { contactLinks } from "./contactData";

function Contatti() {
    return (
        <SectionWrapper id="contatti" align="center">
            <SectionHeading>Contattami 📬</SectionHeading>

            <Stack direction="column" gap="6" mt="6" align="center">
                {contactLinks.map((contact) => (
                    <ContactCard
                        key={contact.label}
                        label={contact.label}
                        value={contact.value}
                        href={contact.href}
                        icon={contact.icon}
                    />
                ))}
            </Stack>

            <Box mt="14">
                <ActionButton
                    href="#home"
                    onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                >
                    Torna al menu
                </ActionButton>
            </Box>
        </SectionWrapper>
    );
}

export default Contatti;

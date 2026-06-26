import { Text } from "@chakra-ui/react";

function SectionHeading({ children, as = "h2" }) {
    return (
        <Text
            as={as}
            fontSize={{ base: "3xl", md: "5xl" }}
            textAlign="center"
            fontWeight="bold"
            color="#00FF41"
            mb="6"
        >
            {children}
        </Text>
    );
}

export default SectionHeading;

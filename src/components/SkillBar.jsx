import { Box, Flex, Text } from "@chakra-ui/react";

function SkillBar({ name, percentage, level }) {
    return (
        <Box w="100%">
            <Flex justify="space-between" align="baseline" mb="2">
                <Text fontFamily="monospace" fontSize="lg" fontWeight="bold" color="#e0e0e0">
                    {name}
                </Text>
                <Text fontFamily="monospace" fontSize="sm" color="#a0a0a0">
                    {level} · {percentage}%
                </Text>
            </Flex>

            <Box w="100%" h="10px" bg="#111" borderRadius="full" border="1px solid #333" overflow="hidden">
                <Box
                    h="100%"
                    w={`${percentage}%`}
                    bg="#00FF41"
                    borderRadius="full"
                    transition="width 0.8s ease-in-out"
                />
            </Box>
        </Box>
    );
}

export default SkillBar;

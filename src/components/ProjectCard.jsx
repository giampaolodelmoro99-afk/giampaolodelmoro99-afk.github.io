import { Box, Text, Wrap, Tag } from "@chakra-ui/react";

function GithubIcon() {
    return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="#00FF41">
            <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385 0.6 0.113 0.82-0.258 0.82-0.577 0-0.285-0.01-1.04-0.015-2.04-3.338 0.724-4.042-1.61-4.042-1.61-0.546-1.387-1.333-1.756-1.333-1.756-1.089-0.745 0.084-0.729 0.084-0.729 1.205 0.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495 0.998 0.108-0.776 0.417-1.305 0.76-1.605-2.665-0.3-5.467-1.332-5.467-5.93 0-1.31 0.467-2.38 1.235-3.22-0.135-0.303-0.54-1.523 0.105-3.176 0 0 1.005-0.322 3.3 1.23 0.957-0.266 1.983-0.399 3.003-0.404 1.02 0.005 2.047 0.138 3.006 0.404 2.29-1.552 3.297-1.23 3.297-1.23 0.646 1.653 0.24 2.873 0.105 3.176 0.77 0.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.479 5.92 0.43 0.372 0.814 1.103 0.814 2.222 0 1.606-0.014 2.896-0.014 3.286 0 0.319 0.216 0.694 0.824 0.576 4.766-1.589 8.2-6.084 8.2-11.385 0-6.627-5.373-12-12-12z" />
        </svg>
    );
}

function ProjectCard({ title, description, tech, repo }) {
    return (
        <Box
            as="a"
            href={repo}
            target="_blank"
            rel="noopener noreferrer"
            display="block"
            bg="#111"
            border="1px solid #333"
            borderRadius="lg"
            overflow="hidden"
            transition="all 0.3s ease-in-out"
            _hover={{
                borderColor: "#00FF41",
                transform: "translateY(-4px)",
            }}
        >
            <Box
                w="100%"
                h="90px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="#0a0a0a"
                borderBottom="1px solid #333"
            >
                <GithubIcon />
            </Box>

            <Box p="3">
                <Text fontFamily="monospace" fontSize="sm" fontWeight="bold" color="#00FF41" mb="1">
                    {title}
                </Text>

                <Text fontFamily="monospace" fontSize="xs" color="#a0a0a0" mb="2">
                    {description}
                </Text>

                <Wrap gap="1">
                    {tech.map((t) => (
                        <Tag.Root
                            key={t}
                            size="xs"
                            variant="outline"
                            borderRadius="full"
                            borderColor="#00FF41"
                            color="#00FF41"
                        >
                            <Tag.Label fontFamily="monospace" fontSize="2xs" color="#00FF41">{t}</Tag.Label>
                        </Tag.Root>
                    ))}
                </Wrap>
            </Box>
        </Box>
    );
}

export default ProjectCard;

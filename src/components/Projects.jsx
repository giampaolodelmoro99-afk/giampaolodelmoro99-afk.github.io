import { SimpleGrid } from "@chakra-ui/react";
import SectionWrapper from "./SectionWrapper";
import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";
import NextSectionLink from "./NextSectionLink";
import { projects } from "./projectsData";

function Projects() {
    return (
        <SectionWrapper id="progetti" align="flex-start" pt={{ base: "100px", md: "180px" }} maxW="1350px">
            <SectionHeading>Progetti 📂</SectionHeading>

            <SimpleGrid
                columns={{ base: 1, md: 2, lg: 4 }}
                gap={{ base: "4", md: "4" }}
                w="100%"
                mt="4"
            >
                {projects.map((project) => (
                    <ProjectCard
                        key={project.repo}
                        title={project.title}
                        description={project.description}
                        tech={project.tech}
                        repo={project.repo}
                    />
                ))}
            </SimpleGrid>

            <NextSectionLink href="#contatti" label="Vai a Contattami" />
        </SectionWrapper>
    );
}

export default Projects;

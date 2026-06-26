import { SimpleGrid } from "@chakra-ui/react";
import SectionWrapper from "./SectionWrapper";
import SectionHeading from "./SectionHeading";
import SkillBar from "./SkillBar";
import NextSectionLink from "./NextSectionLink";
import { skills } from "./skillsData";

function Skills() {
    return (
        <SectionWrapper id="skill" align="flex-start" pt={{ base: "100px", md: "180px" }}>
            <SectionHeading>Skills 🛠️</SectionHeading>

            <SimpleGrid
                columns={{ base: 1, md: 2 }}
                gap={{ base: "6", md: "10" }}
                w="100%"
                mt="6"
            >
                {skills.map((skill) => (
                    <SkillBar
                        key={skill.name}
                        name={skill.name}
                        percentage={skill.percentage}
                        level={skill.level}
                    />
                ))}
            </SimpleGrid>

            <NextSectionLink href="#progetti" label="Vai a Progetti" />
        </SectionWrapper>
    );
}

export default Skills;

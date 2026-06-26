import { Link } from "@chakra-ui/react";

function NavLink({ href, children, target, rel }) {
    return (
        <Link
            href={href}
            target={target}
            rel={rel}
            fontSize="xl"
            fontWeight="medium"
            fontFamily="monospace"
            color="#00FF41"
            position="relative"
            textDecoration="none"
            _hover={{
                textDecoration: "none",
                _after: { width: "100%" },
            }}
            _after={{
                content: '""',
                position: "absolute",
                width: "0%",
                height: "2px",
                bottom: "-5px",
                left: "50%",
                transform: "translateX(-50%)",
                bg: "#00FF41",
                transition: "width 0.3s ease-in-out",
            }}
        >
            {children}
        </Link>
    );
}

export default NavLink;

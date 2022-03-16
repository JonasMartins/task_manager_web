import { Flex, Heading, Text, useColorMode } from "@chakra-ui/react";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";

interface FooterProps {}

const Footer: NextPage<FooterProps> = ({}) => {
    const { colorMode } = useColorMode();
    const bgColor = { light: "grey.100", dark: "gray.800" };

    return (
        <Flex
            flexGrow={1}
            bg={bgColor[colorMode]}
            minH="15em"
            alignItems="center"
            justifyContent="center"
            mt={10}
        >
            <Heading fontWeight="light">Task Manager</Heading>
        </Flex>
    );
};
export default Footer;

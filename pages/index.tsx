import type { NextPage } from "next";
import { VStack } from "@chakra-ui/react";
import Login from "../components/Login";

const Home: NextPage = () => {
    return (
        <VStack>
            {/* <Container maxW="container.xl">Extra-Large Container</Container>
            <Container maxW="container.lg">Large Container</Container>
            <Container maxW="container.md">Medium Container</Container>
            <Container maxW="container.sm">Small Container</Container> */}
            <Login />
        </VStack>
    );
};

export default Home;

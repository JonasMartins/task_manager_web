import {
    Box,
    Flex,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Heading,
    useColorMode,
    Switch,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { BsMoon, BsSun } from "react-icons/bs";
import LoginForm from "./form/login.form";
import RegisterForm from "./form/register.form";

interface LoginProps {}

const Login: NextPage<LoginProps> = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Flex flexDir="column" flexGrow={1} height="100vh" width="100%">
            <Flex justifyContent="flex-end">
                <Flex m={2}>
                    {colorMode === "light" ? (
                        <BsSun color="black" size="40px" />
                    ) : (
                        <BsMoon color="white" size="40px" />
                    )}
                </Flex>
                <Switch
                    colorScheme="purple"
                    size="lg"
                    id="changeColorMode"
                    onChange={toggleColorMode}
                    m={2}
                    p={2}
                />
            </Flex>
            <Flex mb={5} mt={5} alignItems={"center"} justifyContent="center">
                <Heading textAlign="center" fontWeight="light">
                    Task Manager
                </Heading>
            </Flex>
            <Flex alignItems={"center"} justifyContent="center">
                <Box
                    opacity={0.8}
                    boxShadow="xl"
                    p="6"
                    rounded="md"
                    padding={"2em"}
                    width={"20em"}
                    alignSelf="stretch"
                >
                    <Tabs
                        isFitted
                        variant="soft-rounded"
                        colorScheme="primary.500"
                    >
                        <TabList>
                            <Tab
                                color={colorMode === "dark" ? "white" : "black"}
                            >
                                Log In
                            </Tab>
                            <Tab
                                color={colorMode === "dark" ? "white" : "black"}
                            >
                                Register
                            </Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <LoginForm />
                            </TabPanel>
                            <TabPanel>
                                <RegisterForm />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Flex>
        </Flex>
    );
};

export default Login;

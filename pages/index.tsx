import type { NextPage } from "next";
import {
    Container,
    Flex,
    IconButton,
    Switch,
    Text,
    Tooltip,
    useColorMode,
    VStack,
} from "@chakra-ui/react";
import { BsMoon, BsSun } from "react-icons/bs";
import { AiOutlineLogout } from "react-icons/ai";
import { useCookies } from "react-cookie";
import { cookie_name } from "../utils/consts";
import { useRouter } from "next/router";
const Home: NextPage = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const [cookies, setCookie, removeCookie] = useCookies(["task_manager"]);
    const router = useRouter();
    const bgColor = { light: "white", dark: "gray.600" };
    const bgBodyColor = { light: "gray.50", dark: "gray.700" };

    return (
        <Flex
            flexDir="column"
            bg={bgBodyColor[colorMode]}
            height="100vh"
            width="100%"
        >
            <Flex justifyContent="flex-end" alignItems="center">
                <Flex m={2}>
                    {colorMode === "light" ? (
                        <BsSun color="black" size="40px" />
                    ) : (
                        <BsMoon color="white" size="40px" />
                    )}
                </Flex>
                <Switch
                    colorScheme="cyan"
                    size="lg"
                    id="changeColorMode"
                    onChange={toggleColorMode}
                    m={2}
                    p={2}
                />
                <Flex p={3} m={2}>
                    <Tooltip aria-label="logout" label="logout" hasArrow={true}>
                        <IconButton
                            isRound={true}
                            aria-label="logout"
                            icon={<AiOutlineLogout />}
                            onClick={() => {
                                removeCookie(cookie_name);
                                router.push("/login");
                            }}
                        />
                    </Tooltip>
                </Flex>
            </Flex>

            <VStack>
                <Container maxW="container.md" bg={bgColor[colorMode]}>
                    <Flex justifyContent={"center"} boxShadow="lg">
                        <Text>Dashboard</Text>
                    </Flex>
                </Container>
            </VStack>
        </Flex>
    );
};

export default Home;

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
import { useEffect, useState } from "react";
import { useUser } from "../components/hooks/useUser";
import BeatLoaderCustom from "../components/layout/BeatLoaderCustom";

const Home: NextPage = () => {
    const bgColor = { light: "white", dark: "gray.600" };
    const bgBodyColor = { light: "gray.50", dark: "gray.700" };

    const { colorMode, toggleColorMode } = useColorMode();
    const [cookies, setCookie, removeCookie] = useCookies([cookie_name]);
    const [loadEffect, setLoadEffect] = useState(false);
    const router = useRouter();
    const user = useUser();

    useEffect(() => {
        setLoadEffect(true);
        const load = setTimeout(() => {
            setLoadEffect(false);
        }, 500);
        return () => {
            clearTimeout(load);
        };
    }, [user?.id]);

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

            {loadEffect ? (
                <BeatLoaderCustom />
            ) : (
                <VStack>
                    <Container maxW="container.md" bg={bgColor[colorMode]}>
                        <Flex justifyContent={"center"} boxShadow="lg">
                            <Text>Welcome {user?.name}</Text>
                        </Flex>
                    </Container>
                </VStack>
            )}
        </Flex>
    );
};

export default Home;

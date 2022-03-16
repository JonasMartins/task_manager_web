import type { NextPage } from "next";
import {
    Button,
    Circle,
    Container,
    Flex,
    Heading,
    IconButton,
    Input,
    Switch,
    Tab,
    TabList,
    Tabs,
    Text,
    Tooltip,
    useColorMode,
    VStack,
} from "@chakra-ui/react";
import { BsMoon, BsSun } from "react-icons/bs";
import {
    AiOutlineLogout,
    AiOutlineArrowDown,
    AiOutlineArrowUp,
} from "react-icons/ai";
import { useCookies } from "react-cookie";
import { cookie_name } from "../utils/consts";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "../components/hooks/useUser";
import BeatLoaderCustom from "../components/layout/BeatLoaderCustom";
import { UserResponse } from "./../utils/types";
import axiosConfig from "../utils/axios.config";
import Task from "./../components/Task";
import { BiPlus } from "react-icons/bi";
import Footer from "../components/layout/Footer";

const Home: NextPage = () => {
    const bgColor = { light: "white", dark: "gray.800" };
    const { colorMode, toggleColorMode } = useColorMode();
    const [profile, setProfile] = useState<UserResponse | null>(null);
    const [cookies, setCookie, removeCookie] = useCookies([cookie_name]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadEffect, setLoadEffect] = useState(false);
    const router = useRouter();
    const user = useUser();
    const [decrescentCreated, setDecrescentCreated] = useState(false);

    const handleGetProfile = useCallback(
        async (id: string) => {
            setLoading(true);
            const response: UserResponse = await axiosConfig.get(
                `users/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${cookies[cookie_name]}`,
                    },
                }
            );
            setLoading(false);
            if (response.data) {
                setProfile(response);
            }
        },
        [user?.id]
    );

    useEffect(() => {
        setLoadEffect(true);

        if (user?.id) {
            handleGetProfile(user.id);
        }

        const load = setTimeout(() => {
            setLoadEffect(false);
        }, 500);
        return () => {
            clearTimeout(load);
        };
    }, [user?.id]);

    return (
        <Flex flexDir="column" height="100vh" width="100%">
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

            {loadEffect || loading ? (
                <BeatLoaderCustom />
            ) : (
                <VStack>
                    <Container maxW="container.md">
                        <Flex
                            justifyContent={"center"}
                            boxShadow="lg"
                            flexDir="column"
                            bg={bgColor[colorMode]}
                        >
                            <Heading
                                textAlign="center"
                                fontWeight="thin"
                                mt={3}
                            >
                                Welcome {user?.name}
                            </Heading>

                            <Flex
                                justifyContent="space-between"
                                alignItems="center"
                                p={2}
                                mt={10}
                                mb={5}
                            >
                                <Flex flexGrow={1}>
                                    <Input placeholder="Filter Task" mr={4} />
                                </Flex>
                                <Tooltip
                                    hasArrow={true}
                                    label="Add New task"
                                    aria-label="Add new Task"
                                >
                                    <IconButton
                                        isRound={true}
                                        aria-label="Add new task"
                                        icon={<BiPlus />}
                                        colorScheme="cyan"
                                    />
                                </Tooltip>
                            </Flex>
                            <Flex m={2}>
                                <Tooltip
                                    hasArrow={true}
                                    label="Filter Tasks By Badges"
                                    aria-label="filter By Badges"
                                >
                                    <Tabs isLazy isFitted align="center">
                                        <TabList>
                                            <Tab>
                                                <Circle
                                                    size="15px"
                                                    bg="grey.100"
                                                />
                                            </Tab>
                                            <Tab>
                                                <Circle size="15px" bg="red" />
                                            </Tab>
                                            <Tab>
                                                <Circle
                                                    size="15px"
                                                    bg="orange"
                                                />
                                            </Tab>
                                            <Tab>
                                                <Circle
                                                    size="15px"
                                                    bg="yellow"
                                                />
                                            </Tab>
                                            <Tab>
                                                <Circle
                                                    size="15px"
                                                    bg="green"
                                                />
                                            </Tab>
                                            <Tab>
                                                <Circle
                                                    size="15px"
                                                    bg="blue.400"
                                                />
                                            </Tab>
                                        </TabList>
                                    </Tabs>
                                </Tooltip>
                            </Flex>
                            <Flex mt={2}>
                                <Tooltip
                                    hasArrow={true}
                                    label="Order Tasks by creation"
                                    aria-label="Order Tasks by creation"
                                >
                                    <Button
                                        variant="ghost"
                                        name="created"
                                        fontWeight="thin"
                                        ml={2}
                                        rightIcon={
                                            decrescentCreated ? (
                                                <AiOutlineArrowUp />
                                            ) : (
                                                <AiOutlineArrowDown />
                                            )
                                        }
                                    >
                                        Created At
                                    </Button>
                                </Tooltip>
                                <Tooltip
                                    hasArrow={true}
                                    label="Order Tasks by title"
                                    aria-label="Order Tasks by title"
                                >
                                    <Button
                                        variant="ghost"
                                        name="created"
                                        fontWeight="thin"
                                        ml={2}
                                        rightIcon={
                                            decrescentCreated ? (
                                                <AiOutlineArrowUp />
                                            ) : (
                                                <AiOutlineArrowDown />
                                            )
                                        }
                                    >
                                        Title
                                    </Button>
                                </Tooltip>
                            </Flex>
                            {profile?.data?.user?.tasks.map((x) => (
                                <Task task={x} />
                            ))}
                        </Flex>
                    </Container>
                </VStack>
            )}
            <Footer />
        </Flex>
    );
};

export default Home;

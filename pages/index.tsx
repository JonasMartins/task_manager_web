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
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    Tooltip,
    useColorMode,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import { BsMoon, BsSun } from "react-icons/bs";
import {
    AiOutlineLogout,
    AiOutlineArrowDown,
    AiOutlineArrowUp,
} from "react-icons/ai";
import { useCookies } from "react-cookie";
import { cookie_name, TaskBadge } from "../utils/consts";
import { useRouter } from "next/router";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useUser } from "../components/hooks/useUser";
import BeatLoaderCustom from "../components/layout/BeatLoaderCustom";
import { UserResponse, Task as TaskType } from "./../utils/types";
import axiosConfig from "../utils/axios.config";
import Task from "./../components/Task";
import { BiPlus } from "react-icons/bi";
import { MdOutlineClear } from "react-icons/md";
import Footer from "../components/layout/Footer";
import {
    filterByTitle,
    filterTasksByBadge,
} from "./../utils/tasksAuxFunctions";
import CreateTaskModal from "../components/modal/createTaskModal";

const Home: NextPage = () => {
    const _createTaskModal = useDisclosure();
    const bgColor = { light: "white", dark: "gray.800" };
    const { colorMode, toggleColorMode } = useColorMode();
    const [tasks, setTasks] = useState<Array<TaskType>>([]);
    const [defaulTasks, setDefaulTasks] = useState<Array<TaskType>>([]);
    const [cookies, setCookie, removeCookie] = useCookies([cookie_name]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadEffect, setLoadEffect] = useState(false);
    const router = useRouter();
    const user = useUser();
    const [decrescentCreated, setDecrescentCreated] = useState(false);
    const [decrescentTitle, setDecrescentTitle] = useState(false);
    const [decrescentStart, setDecrescentStart] = useState(false);
    const [inputField, setInputField] = useState("");

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
            if (response.data.user?.tasks) {
                setTasks([]);
                response.data.user.tasks.map((x, index) => {
                    // testing limit the tasks length
                    if (index < 6) {
                        setTasks((prevTask) => [...prevTask, x]);
                        setDefaulTasks((prevDefTasks) => [...prevDefTasks, x]);
                    }
                });
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
            setTasks([]);
            console.log("here?");
            setDefaulTasks([]);
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
                                    <Input
                                        placeholder="Filter Task"
                                        mr={4}
                                        value={inputField}
                                        onChange={(
                                            event: ChangeEvent<HTMLInputElement>
                                        ) => {
                                            setInputField(event.target.value);
                                            if (!event.target.value.length) {
                                                setTasks([]);
                                                setTasks(defaulTasks);
                                            } else {
                                                setTasks([]);
                                                setTasks(
                                                    filterByTitle(
                                                        event.target.value,
                                                        defaulTasks
                                                    )
                                                );
                                            }
                                        }}
                                    />
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
                                        onClick={() => {
                                            _createTaskModal.onOpen();
                                        }}
                                    />
                                </Tooltip>
                            </Flex>
                            <Flex m={2}>
                                <Tooltip
                                    hasArrow={true}
                                    label="Filter Tasks By Badges"
                                    aria-label="filter By Badges"
                                >
                                    <Tabs
                                        isLazy
                                        isFitted
                                        align="center"
                                        onChange={(index) => {
                                            setTasks([]);
                                            setTasks(
                                                filterTasksByBadge(
                                                    index,
                                                    defaulTasks
                                                )
                                            );
                                        }}
                                    >
                                        <TabList>
                                            <Tab>
                                                <Circle
                                                    size="15px"
                                                    bg={
                                                        colorMode === "dark"
                                                            ? "grey.700"
                                                            : "white"
                                                    }
                                                >
                                                    <MdOutlineClear />
                                                </Circle>
                                            </Tab>
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
                                        onClick={() => {
                                            setDecrescentCreated(
                                                !decrescentCreated
                                            );
                                            if (decrescentCreated) {
                                                tasks.sort(
                                                    (
                                                        a: TaskType,
                                                        b: TaskType
                                                    ) =>
                                                        b.createdAt >
                                                        a.createdAt
                                                            ? 1
                                                            : -1
                                                );
                                            } else {
                                                tasks.sort(
                                                    (
                                                        a: TaskType,
                                                        b: TaskType
                                                    ) =>
                                                        b.createdAt <
                                                        a.createdAt
                                                            ? 1
                                                            : -1
                                                );
                                            }
                                        }}
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
                                            decrescentTitle ? (
                                                <AiOutlineArrowUp />
                                            ) : (
                                                <AiOutlineArrowDown />
                                            )
                                        }
                                        onClick={() => {
                                            setDecrescentTitle(
                                                !decrescentTitle
                                            );
                                            if (decrescentTitle) {
                                                tasks.sort(
                                                    (
                                                        a: TaskType,
                                                        b: TaskType
                                                    ) =>
                                                        b.title > a.title
                                                            ? 1
                                                            : -1
                                                );
                                            } else {
                                                tasks.sort(
                                                    (
                                                        a: TaskType,
                                                        b: TaskType
                                                    ) =>
                                                        b.title < a.title
                                                            ? 1
                                                            : -1
                                                );
                                            }
                                        }}
                                    >
                                        Title
                                    </Button>
                                </Tooltip>
                                <Tooltip
                                    hasArrow={true}
                                    label="Order Tasks by start"
                                    aria-label="Order Tasks by start"
                                >
                                    <Button
                                        variant="ghost"
                                        name="start"
                                        fontWeight="thin"
                                        ml={2}
                                        rightIcon={
                                            decrescentStart ? (
                                                <AiOutlineArrowUp />
                                            ) : (
                                                <AiOutlineArrowDown />
                                            )
                                        }
                                        onClick={() => {
                                            setDecrescentStart(
                                                !decrescentStart
                                            );
                                            if (decrescentStart) {
                                                tasks.sort(
                                                    (
                                                        a: TaskType,
                                                        b: TaskType
                                                    ) =>
                                                        b.start > a.start
                                                            ? 1
                                                            : -1
                                                );
                                            } else {
                                                tasks.sort(
                                                    (
                                                        a: TaskType,
                                                        b: TaskType
                                                    ) =>
                                                        b.start < a.start
                                                            ? 1
                                                            : -1
                                                );
                                            }
                                        }}
                                    >
                                        Start
                                    </Button>
                                </Tooltip>
                            </Flex>
                            {tasks.map((x) => (
                                <Task key={x.id} task={x} />
                            ))}
                        </Flex>
                    </Container>
                </VStack>
            )}
            <Footer />
            <CreateTaskModal
                isOpen={_createTaskModal.isOpen}
                onClose={_createTaskModal.onClose}
            />
        </Flex>
    );
};

export default Home;

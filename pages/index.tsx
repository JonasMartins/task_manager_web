import {
    Button,
    Container,
    Flex,
    Heading,
    IconButton,
    Input,
    Switch,
    Tab,
    TabList,
    Tabs,
    Tooltip,
    useColorMode,
    useDisclosure,
    useToast,
    VStack,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {
    AiOutlineArrowDown,
    AiOutlineArrowUp,
    AiOutlineLogout,
} from "react-icons/ai";
import { BiPlus } from "react-icons/bi";
import { BsMoon, BsSun } from "react-icons/bs";
import { MdOutlineClear } from "react-icons/md";
import { useUser } from "../components/hooks/useUser";
import BeatLoaderCustom from "../components/layout/BeatLoaderCustom";
import Footer from "../components/layout/Footer";
import CreateTaskModal from "../components/modal/createTaskModal";
import axiosConfig from "../utils/axios.config";
import { cookie_name } from "../utils/consts";
import Task from "./../components/Task";
import {
    filterByTitle,
    filterTasksByBadge,
} from "./../utils/tasksAuxFunctions";
import { Task as TaskType, UserResponse } from "./../utils/types";

const Home: NextPage = () => {
    const _createTaskModal = useDisclosure();

    const user = useUser();
    const toast = useToast();
    const router = useRouter();
    const bgColor = { light: "white", dark: "gray.800" };
    const { colorMode, toggleColorMode } = useColorMode();
    const [tasks, setTasks] = useState<Array<TaskType>>([]);
    const [defaulTasks, setDefaulTasks] = useState<Array<TaskType>>([]);
    const [cookies, setCookie, removeCookie] = useCookies([cookie_name]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadEffect, setLoadEffect] = useState(false);
    const [decrescentCreated, setDecrescentCreated] = useState(false);
    const [decrescentTitle, setDecrescentTitle] = useState(false);
    const [decrescentStart, setDecrescentStart] = useState(false);
    const [inputField, setInputField] = useState("");
    const [countUpdate, setCountUpdate] = useState(0);
    const updatedCallback = (value: number): void => {
        setCountUpdate(value);
    };

    const taskCreatedCallback = (task: TaskType) => {
        toast({
            title: "Task Created",
            description: "Task successfully created",
            status: "success",
            duration: 8000,
            isClosable: true,
            position: "top",
        });
        setTasks((prevTask) => [task, ...prevTask]);
    };

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
                response.data.user.tasks.map((x) => {
                    setTasks((prevTask) => [...prevTask, x]);
                    setDefaulTasks((prevDefTasks) => [...prevDefTasks, x]);
                });
            }
        },
        [user?.id]
    );

    useEffect(() => {
        if (countUpdate) {
            _createTaskModal.onClose();
        }
    }, [countUpdate]);

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
                                                <MdOutlineClear />
                                            </Tab>
                                            <Tab>⚪</Tab>
                                            <Tab>🔴</Tab>
                                            <Tab>🟠</Tab>
                                            <Tab>🟡</Tab>
                                            <Tab>🟢</Tab>
                                            <Tab>🔵</Tab>
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
                loggedUser={user}
                countUpdate={countUpdate}
                updateCallback={updatedCallback}
                taskCreatedCallback={taskCreatedCallback}
            />
        </Flex>
    );
};

export default Home;

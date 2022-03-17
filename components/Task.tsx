import {
    Checkbox,
    Circle,
    Flex,
    IconButton,
    Text,
    Tooltip,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { Task as TaskType } from "./../utils/types";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { formatRelative } from "date-fns";
import { getBadgeColor } from "./../utils/tasksAuxFunctions";
import DeleteTaskModal from "./modal/deleteTaskModal";
import UpdateTaskModal from "./modal/updateTaskModal";
import { useState } from "react";
import { useUser } from "./hooks/useUser";

interface TaskProps {
    task: TaskType;
}

const Task: NextPage<TaskProps> = ({ task }) => {
    const user = useUser();
    const toast = useToast();
    const _deleteTaskModal = useDisclosure();
    const _updateTaskModal = useDisclosure();
    const [countUpdate, setCountUpdate] = useState(0);
    const [taskState, setTaskState] = useState<TaskType>(task);
    const updatedCallback = (value: number): void => {
        setCountUpdate(value);
    };

    const taskUpdateCallback = (task: TaskType) => {
        setTaskState(task);
        toast({
            title: "Task Upated",
            description: "Task successfully Updated",
            status: "success",
            duration: 8000,
            isClosable: true,
            position: "top",
        });
        _updateTaskModal.onClose();
    };

    return (
        <Flex boxShadow="md" p={2} m={2}>
            <Flex flexDir="column" width="100%">
                <Flex justifyContent="space-between">
                    <Tooltip label="Badge" hasArrow>
                        <Circle
                            size="15px"
                            bg={getBadgeColor(taskState.badge)}
                        />
                    </Tooltip>
                    <Checkbox
                        size="lg"
                        colorScheme="cyan"
                        isChecked={taskState.done}
                        readOnly
                    >
                        Done ?
                    </Checkbox>
                </Flex>
                <Flex flexGrow={1} p={2}>
                    <Text fontWeight="medium">{taskState.title}</Text>
                </Flex>
                <Flex flexGrow={1} p={2}>
                    <Text fontWeight="thin">{taskState.description}</Text>
                </Flex>
                <Flex
                    justifyContent="space-between"
                    p={2}
                    flexGrow={1}
                    alignItems="center"
                    mt={3}
                >
                    <Text
                        fontWeight="thin"
                        fontSize="xs"
                        textAlign="end"
                        ml={3}
                    >
                        Created At:{" "}
                        {formatRelative(
                            new Date(taskState.createdAt),
                            new Date()
                        )}
                    </Text>

                    <Text
                        fontWeight="thin"
                        fontSize="xs"
                        textAlign="end"
                        ml={3}
                    >
                        Start:{" "}
                        {formatRelative(new Date(taskState.start), new Date())}
                    </Text>
                    <Text
                        fontWeight="thin"
                        fontSize="xs"
                        textAlign="end"
                        ml={3}
                    >
                        Finish:{" "}
                        {formatRelative(new Date(taskState.finish), new Date())}
                    </Text>
                    <Flex>
                        <Tooltip label="Edit Task" hasArrow>
                            <IconButton
                                mr={2}
                                isRound={true}
                                aria-label="Edit task"
                                icon={<AiOutlineEdit />}
                                onClick={() => {
                                    _updateTaskModal.onOpen();
                                }}
                            />
                        </Tooltip>
                        <Tooltip label="Delete Task" hasArrow>
                            <IconButton
                                mr={2}
                                isRound={true}
                                aria-label="Delete task"
                                icon={<BsTrash />}
                                onClick={() => {
                                    _deleteTaskModal.onOpen();
                                }}
                            />
                        </Tooltip>
                    </Flex>
                </Flex>
            </Flex>
            <DeleteTaskModal
                isOpen={_deleteTaskModal.isOpen}
                onClose={_deleteTaskModal.onClose}
            />

            <UpdateTaskModal
                isOpen={_updateTaskModal.isOpen}
                onClose={_updateTaskModal.onClose}
                loggedUser={user}
                currentTask={taskState}
                countUpdate={countUpdate}
                updateCallback={updatedCallback}
                taskUpdateCallback={taskUpdateCallback}
            />
        </Flex>
    );
};

export default Task;

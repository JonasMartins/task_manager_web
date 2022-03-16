import {
    Checkbox,
    Circle,
    Flex,
    IconButton,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { Task as TaskType } from "./../utils/types";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { formatRelative } from "date-fns";
import { getBadgeColor } from "./../utils/tasksAuxFunctions";

interface TaskProps {
    task: TaskType;
}

const Task: NextPage<TaskProps> = ({ task }) => {
    return (
        <Flex boxShadow="md" p={2} m={2}>
            <Flex flexDir="column" width="100%">
                <Flex justifyContent="space-between">
                    <Tooltip label="Badge" hasArrow>
                        <Circle size="15px" bg={getBadgeColor(task.badge)} />
                    </Tooltip>
                    <Checkbox size="lg" colorScheme="cyan" isChecked readOnly>
                        Done ?
                    </Checkbox>
                </Flex>
                <Flex flexGrow={1} p={2}>
                    <Text fontWeight="thin">{task.description}</Text>
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
                        {formatRelative(new Date(task.createdAt), new Date())}
                    </Text>
                    <Flex>
                        <Tooltip label="Edit Task" hasArrow>
                            <IconButton
                                mr={2}
                                isRound={true}
                                aria-label="Edit task"
                                icon={<AiOutlineEdit />}
                            />
                        </Tooltip>
                        <Tooltip label="Delete Task" hasArrow>
                            <IconButton
                                mr={2}
                                isRound={true}
                                aria-label="Delete task"
                                icon={<BsTrash />}
                            />
                        </Tooltip>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Task;

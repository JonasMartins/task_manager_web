import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Flex,
    Text,
    Input,
    useColorMode,
} from "@chakra-ui/react";
import { TaskBadge } from "../../utils/consts";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CreateTaskModalProps {
    onClose: () => void;
    isOpen: boolean;
}

interface inputValues {
    title: string;
    description: string;
    start: Date;
    finish: Date;
    badge?: TaskBadge;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [startDate, setStartDate] = useState(new Date());
    const [finishDate, setFinishDate] = useState(new Date());
    const { colorMode } = useColorMode();
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior={"inside"}
            size={"lg"}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent="center">
                        <Text fontWeight="thin" fontSize="2xl">
                            Create Task
                        </Text>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex justifyContent="space-between">
                        <Flex flexDir="column" color="black">
                            <Text
                                color={colorMode === "dark" ? "white" : "black"}
                            >
                                Start:
                            </Text>
                            <DatePicker
                                showTimeSelect
                                selected={startDate}
                                onChange={(date: Date) => setStartDate(date)}
                            />
                        </Flex>
                        <Flex flexDir="column" color="black">
                            <Text
                                color={colorMode === "dark" ? "white" : "black"}
                            >
                                Finish:
                            </Text>
                            <DatePicker
                                showTimeSelect
                                selected={finishDate}
                                onChange={(date: Date) => setFinishDate(date)}
                            />
                        </Flex>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <ModalBody></ModalBody>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateTaskModal;

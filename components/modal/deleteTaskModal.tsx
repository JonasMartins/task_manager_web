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
    Button,
    useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { AiOutlineWarning } from "react-icons/ai";
import MiniBeatLoaderCustom from "../../components/layout/MiniBeatLoaderCustom";
import { cookie_name } from "../../utils/consts";
import { DeletedType } from "../../utils/types";
import axiosConfig from "./../../utils/axios.config";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "./../../Redux/actions";

interface DeleteTaskModalProps {
    onClose: () => void;
    isOpen: boolean;
    taskId: string;
}

const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({
    isOpen,
    onClose,
    taskId,
}) => {
    const toast = useToast();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [loadEffect, setLoadEffect] = useState(false);
    const [cookies, setCookie] = useCookies([cookie_name]);
    const { setHasDeletedTask } = bindActionCreators(actionCreators, dispatch);

    const handleDeleteTask = async () => {
        setLoadEffect(true);
        setLoading(true);
        const result: DeletedType = await axiosConfig({
            method: "DELETE",
            url: `/tasks/${taskId}`,
            headers: {
                Authorization: `Bearer ${cookies[cookie_name]}`,
            },
        });
        setLoading(false);

        if (result.data.error) {
            toast({
                title: "Error",
                description: result.data.error[0].message,
                status: "error",
                duration: 8000,
                isClosable: true,
                position: "top",
            });
        } else {
            setTimeout(() => {
                setLoadEffect(false);
                onClose();
                toast({
                    title: "Task Deleted",
                    description: "Task successfully deleted",
                    status: "success",
                    duration: 8000,
                    isClosable: true,
                    position: "top",
                });
                setHasDeletedTask(taskId);
            }, 500);
        }
    };

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
                        <AiOutlineWarning size="40px" color="red" />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {loadEffect || loading ? (
                        <MiniBeatLoaderCustom />
                    ) : (
                        <Flex alignItems="center" flexDir="column">
                            <Text>
                                Are you sure you wanna delete this Task ?
                            </Text>
                            <Button
                                size="lg"
                                mt={10}
                                colorScheme="red"
                                borderRadius="1.5em"
                                onClick={handleDeleteTask}
                            >
                                Yes
                            </Button>
                        </Flex>
                    )}
                </ModalBody>
                <ModalFooter>
                    <ModalBody></ModalBody>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteTaskModal;

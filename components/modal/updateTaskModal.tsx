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
} from "@chakra-ui/react";

interface UpdateTaskModalProps {
    onClose: () => void;
    isOpen: boolean;
}

const UpdateTaskModal: React.FC<UpdateTaskModalProps> = ({
    isOpen,
    onClose,
}) => {
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
                            Update Task
                        </Text>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody></ModalBody>
                <ModalFooter>
                    <ModalBody></ModalBody>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default UpdateTaskModal;

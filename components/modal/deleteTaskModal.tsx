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

interface DeleteTaskModalProps {
    onClose: () => void;
    isOpen: boolean;
}

const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({
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
                            Confirm remove
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

export default DeleteTaskModal;

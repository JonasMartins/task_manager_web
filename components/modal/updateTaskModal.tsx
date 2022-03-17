import {
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Stack,
    Text,
    Textarea,
    useColorMode,
    useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik, FormikProps, validateYupSchema } from "formik";
import React, { ComponentProps, useState } from "react";
import { useCookies } from "react-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as Yup from "yup";
import BeatLoaderCustom from "../../components/layout/BeatLoaderCustom";
import { cookie_name, TaskBadge, TaskPriority } from "../../utils/consts";
import { Task, TaskResponse } from "../../utils/types";
import { loggedUserType } from "../hooks/useUser";
import axiosConfig from "./../../utils/axios.config";

type InputProps = ComponentProps<typeof Input>;

const ChakraInput = (props: InputProps) => {
    return <Input {...props} borderRadius="1em" size={"sm"} variant="filled" />;
};

type TextAreaProps = ComponentProps<typeof Textarea>;
type DatePickProps = ComponentProps<typeof DatePicker>;
type SelectProps = ComponentProps<typeof Select>;
type CheckBoxProps = ComponentProps<typeof Checkbox>;

const ChakraCheckbox = (props: CheckBoxProps) => {
    return <Checkbox {...props} />;
};

const ChakraTextArea = (props: TextAreaProps) => {
    return (
        <Textarea
            {...props}
            resize="vertical"
            borderRadius="1em"
            size={"sm"}
            variant="filled"
        />
    );
};

const DatePickerFormik = (props: DatePickProps) => {
    return <DatePicker {...props} />;
};

const ChakraSelect = (props: SelectProps) => {
    return (
        <Select {...props} borderRadius="1em" size={"sm"} variant="filled" />
    );
};

const UpdateTaskSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, "Too Short!")
        .max(50, "Too Long!")
        .required("Required"),

    description: Yup.string()
        .min(3, "Too Short!")
        .max(1000, "Too Long!")
        .required("Required"),
    start: Yup.date().required("Required"),
    finish: Yup.date().when("start", (start, Yup) => start && Yup.min(start)),
});

interface inputValues {
    title: string;
    description: string;
    start: Date;
    finish: Date;
    done: boolean;
    badge?: TaskBadge;
}

interface UpdateTaskModalProps {
    onClose: () => void;
    isOpen: boolean;
    loggedUser: loggedUserType;
    countUpdate: number;
    currentTask: Task;
    updateCallback: (update: number) => void;
    taskUpdateCallback: (task: Task) => void;
}

const UpdateTaskModal: React.FC<UpdateTaskModalProps> = ({
    isOpen,
    onClose,
    loggedUser,
    countUpdate,
    currentTask,
    updateCallback,
    taskUpdateCallback,
}) => {
    const toast = useToast();
    const { colorMode } = useColorMode();
    const [cookies, setCookie] = useCookies([cookie_name]);
    const [startDate, setStartDate] = useState(new Date(currentTask.start));
    const [finishDate, setFinishDate] = useState(new Date(currentTask.finish));
    const [loadEffect, setLoadEffect] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [task, setTask] = useState<Task>(currentTask);

    const initialValues: inputValues = {
        title: task.title,
        badge: task.badge || undefined,
        description: task.description,
        done: task.done,
        start: task.start,
        finish: task.finish,
    };

    const handleSubmit = async (values: inputValues) => {
        setLoading(true);
        const result: TaskResponse = await axiosConfig({
            method: "PUT",
            url: `/tasks/${currentTask.id}`,
            headers: {
                Authorization: `Bearer ${cookies[cookie_name]}`,
            },
            data: {
                title: values.title,
                description: values.description,
                creator_id: loggedUser.id,
                priority: TaskPriority.LOW,
                badge: values.badge,
                done: task.done,
                start: startDate,
                finish: finishDate,
            },
        });
        setLoading(false);

        if (result.data.task) {
            setTask(result.data.task);
            updateCallback(countUpdate + 1);
            taskUpdateCallback(result.data.task);
        }

        return result;
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
                        <Text fontWeight="thin" fontSize="2xl">
                            Create Task
                        </Text>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {loadEffect || loading ? (
                        <BeatLoaderCustom />
                    ) : (
                        <Formik
                            initialValues={initialValues}
                            onSubmit={async (values, actions) => {
                                setLoadEffect(true);
                                setTimeout(() => {
                                    setLoadEffect(false);
                                }, 500);

                                const result = await handleSubmit(values);
                                if (result.data.errors) {
                                    switch (result.data.errors[0].field) {
                                        case "title":
                                            actions.setErrors({
                                                title: "Error Title",
                                            });
                                            break;
                                        case "description":
                                            actions.setErrors({
                                                description:
                                                    "Error description",
                                            });
                                            break;
                                        case "start":
                                            toast({
                                                title: "Error",
                                                description:
                                                    result.data.errors[0]
                                                        .message,
                                                status: "error",
                                                duration: 8000,
                                                isClosable: true,
                                                position: "top",
                                            });
                                            break;
                                        case "finish":
                                            toast({
                                                title: "Error",
                                                description:
                                                    result.data.errors[0]
                                                        .message,
                                                status: "error",
                                                duration: 8000,
                                                isClosable: true,
                                                position: "top",
                                            });
                                            break;
                                        default:
                                            actions.setErrors({});
                                    }
                                }
                            }}
                            validationSchema={UpdateTaskSchema}
                        >
                            {(props: FormikProps<inputValues>) => (
                                <Form>
                                    <Stack spacing={3}>
                                        <FormControl
                                            isInvalid={
                                                props.touched.title &&
                                                !!props.errors.title
                                            }
                                        >
                                            <FormLabel htmlFor="title">
                                                Title
                                            </FormLabel>
                                            <Field
                                                id="title"
                                                type="text"
                                                name="title"
                                                as={ChakraInput}
                                            />
                                            <FormErrorMessage>
                                                {props.errors.title}
                                            </FormErrorMessage>
                                        </FormControl>
                                        <FormControl
                                            isInvalid={
                                                props.touched.description &&
                                                !!props.errors.description
                                            }
                                        >
                                            <FormLabel htmlFor="description">
                                                description
                                            </FormLabel>
                                            <Field
                                                id="description"
                                                type="text"
                                                name="description"
                                                as={ChakraTextArea}
                                            />
                                            <FormErrorMessage>
                                                {props.errors.description}
                                            </FormErrorMessage>
                                        </FormControl>
                                        <FormControl
                                            isInvalid={
                                                props.touched.badge &&
                                                !!props.errors.badge
                                            }
                                        >
                                            <FormLabel htmlFor="badge">
                                                Badge
                                            </FormLabel>
                                            <Field
                                                id="badge"
                                                type="text"
                                                name="badge"
                                                as={ChakraSelect}
                                            >
                                                <option value={""}>
                                                    ⚪ No Badge
                                                </option>
                                                <option value={TaskBadge.RED}>
                                                    🔴 Red
                                                </option>
                                                <option
                                                    value={TaskBadge.ORANGE}
                                                >
                                                    🟠 Orange
                                                </option>
                                                <option
                                                    value={TaskBadge.YELLOW}
                                                >
                                                    🟡 Yellow
                                                </option>
                                                <option value={TaskBadge.GREEN}>
                                                    🟢 Green
                                                </option>
                                                <option value={TaskBadge.BLUE}>
                                                    🔵 Blue
                                                </option>
                                            </Field>
                                            <FormErrorMessage>
                                                {props.errors.badge}
                                            </FormErrorMessage>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel htmlFor="done">
                                                Done ?
                                            </FormLabel>
                                            <Field
                                                id="done"
                                                name="done"
                                                isChecked={task.done}
                                                onChange={() => {
                                                    setTask((prevTask) => ({
                                                        ...prevTask,
                                                        done: !task.done,
                                                    }));
                                                }}
                                                as={ChakraCheckbox}
                                            />
                                        </FormControl>
                                        <FormControl
                                            isInvalid={
                                                props.touched.start &&
                                                !!props.errors.start
                                            }
                                            color="black"
                                        >
                                            <FormLabel
                                                htmlFor="start"
                                                color={
                                                    colorMode === "dark"
                                                        ? "white"
                                                        : "black"
                                                }
                                            >
                                                Start
                                            </FormLabel>
                                            <Field
                                                id="start"
                                                showTimeSelect
                                                as={DatePickerFormik}
                                                selected={startDate}
                                                onChange={(date: Date) => {
                                                    setStartDate(date);
                                                }}
                                                dateFormat="MMMM d, yyyy h:mm"
                                            />

                                            <FormErrorMessage>
                                                {props.errors.start}
                                            </FormErrorMessage>
                                        </FormControl>
                                        <FormControl
                                            isInvalid={
                                                props.touched.finish &&
                                                !!props.errors.finish
                                            }
                                            color="black"
                                        >
                                            <FormLabel
                                                htmlFor="finish"
                                                color={
                                                    colorMode === "dark"
                                                        ? "white"
                                                        : "black"
                                                }
                                            >
                                                Finish
                                            </FormLabel>
                                            <Field
                                                id="finish"
                                                showTimeSelect
                                                selected={finishDate}
                                                onChange={(date: Date) => {
                                                    setFinishDate(date);
                                                }}
                                                name="Finish"
                                                as={DatePickerFormik}
                                                dateFormat="MMMM d, yyyy h:mm"
                                            />

                                            <FormErrorMessage>
                                                {props.errors.finish}
                                            </FormErrorMessage>
                                        </FormControl>
                                        <Button
                                            type="submit"
                                            colorScheme="cyan"
                                            disabled={
                                                props.isSubmitting ||
                                                !!props.errors.title ||
                                                !!props.errors.description
                                            }
                                        >
                                            Submit
                                        </Button>
                                    </Stack>
                                </Form>
                            )}
                        </Formik>
                    )}
                </ModalBody>
                <ModalFooter>
                    <ModalBody></ModalBody>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default UpdateTaskModal;

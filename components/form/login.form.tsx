import {
    Flex,
    Text,
    Input,
    useColorMode,
    Stack,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Button,
} from "@chakra-ui/react";
import { NextPage } from "next";
import * as Yup from "yup";
import { Formik, FormikProps, Form, Field } from "formik";
import React, { ComponentProps } from "react";
import { useRouter } from "next/dist/client/router";
import axiosConfig from "./../../utils/axios.config";
import { cookie_name } from "./../../utils/consts";
import { LoginResponse } from "../../utils/types";
import { useCookies } from "react-cookie";

interface inputValues {
    email: string;
    password: string;
}

type InputProps = ComponentProps<typeof Input>;

const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
        .min(6, "Too Short!")
        .max(50, "Too Long!")
        .required("Required"),
});
const ChakraInput = (props: InputProps) => {
    return <Input {...props} borderRadius="1em" size={"sm"} variant="filled" />;
};

interface LoginFormProps {}

const LoginForm: NextPage<LoginFormProps> = () => {
    const router = useRouter();
    const [cookies, setCookie] = useCookies(["task_manager"]);
    const initialValues: inputValues = { email: "", password: "" };

    const handleCookie = (token: string) => {
        setCookie(cookie_name, token, {
            path: "/",
        });
    };

    const handleLogin = async (values: inputValues): Promise<LoginResponse> => {
        const result: LoginResponse = await axiosConfig.post("/auth/login/", {
            email: values.email,
            password: values.password,
        });

        if (result.data.access_token && typeof window !== "undefined") {
            handleCookie(result.data.access_token!);
        }

        return result;
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={async (values, actions) => {
                const result = await handleLogin(values);
                if (result.data.errors) {
                    switch (result.data.errors[0].field) {
                        case "email":
                            actions.setErrors({
                                email: "Incorrect Email",
                            });
                            break;
                        case "password":
                            actions.setErrors({
                                password: "Incorrect Password",
                            });
                            break;
                        default:
                            actions.setErrors({});
                    }
                } else {
                    router.push("/");
                }
            }}
            validationSchema={LoginSchema}
        >
            {(props: FormikProps<inputValues>) => (
                <Form>
                    <Stack spacing={3}>
                        <FormControl
                            isInvalid={
                                props.touched.email && !!props.errors.email
                            }
                        >
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <Field
                                id="email"
                                type="email"
                                name="email"
                                as={ChakraInput}
                            />
                            <FormErrorMessage>
                                {props.errors.email}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl
                            isInvalid={
                                props.touched.password &&
                                !!props.errors.password
                            }
                        >
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <Field
                                id="password"
                                type="password"
                                name="password"
                                as={ChakraInput}
                            />
                            <FormErrorMessage>
                                {props.errors.password}
                            </FormErrorMessage>
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="cyan"
                            disabled={
                                props.isSubmitting ||
                                !!props.errors.email ||
                                !!props.errors.password
                            }
                        >
                            Submit
                        </Button>
                    </Stack>
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;

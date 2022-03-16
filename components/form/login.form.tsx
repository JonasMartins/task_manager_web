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
import axios from "axios";
import { apiUrl } from "./../../utils/consts";

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
    const { colorMode } = useColorMode();
    const initialValues: inputValues = { email: "", password: "" };

    const handleLogin = async (values: inputValues) => {
        try {
            const result = await axios.post(`${apiUrl}/auth/login/`, {
                email: values.email,
                password: values.password,
            });

            if (result.data.errors) {
                console.log(result.data.errors);
            } else {
                console.log(result.data);
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={async (values) => {
                handleLogin(values);
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

                        <Button type="submit" colorScheme="cyan">
                            Submit
                        </Button>
                    </Stack>
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;

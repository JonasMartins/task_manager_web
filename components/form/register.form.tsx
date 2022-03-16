import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Stack,
} from "@chakra-ui/react";
import { Field, Form, Formik, FormikProps } from "formik";
import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import React, { ComponentProps } from "react";
import { useCookies } from "react-cookie";
import * as Yup from "yup";
import { LoginResponse } from "../../utils/types";
import axiosConfig from "./../../utils/axios.config";
import { cookie_name } from "./../../utils/consts";

const RegisterSchema = Yup.object().shape({
    nameReg: Yup.string()
        .required("Required")
        .min(2, "Too short")
        .max(100, "Too Long!"),
    emailReg: Yup.string().email("Invalid email").required("Required"),
    passwordReg: Yup.string()
        .min(6, "Too Short!")
        .max(50, "Too Long!")
        .required("Required"),
    passwordConfirmationReg: Yup.string().oneOf(
        [Yup.ref("passwordReg"), null],
        "Passwords must mtach"
    ),
});

interface FormValues {
    nameReg: string;
    emailReg: string;
    passwordReg: string;
    passwordConfirmationReg: string;
}

type InputProps = ComponentProps<typeof Input>;

const ChakraInput = (props: InputProps) => {
    return <Input {...props} borderRadius="1em" size={"sm"} variant="filled" />;
};

const RegisterForm: NextPage = () => {
    const initialValues: FormValues = {
        nameReg: "",
        emailReg: "",
        passwordReg: "",
        passwordConfirmationReg: "",
    };
    const [cookies, setCookie] = useCookies(["task_manager"]);
    const router = useRouter();

    const handleCookie = (token: string) => {
        setCookie(cookie_name, token, {
            path: "/",
        });
    };

    const handleRegister = async (
        values: FormValues
    ): Promise<LoginResponse> => {
        const result: LoginResponse = await axiosConfig.post(
            "/auth/register/",
            {
                name: values.nameReg,
                email: values.emailReg,
                password: values.passwordReg,
            }
        );
        if (result.data.access_token && typeof window !== "undefined") {
            handleCookie(result.data.access_token!);
        }

        return result;
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={async (values, actions) => {
                const result = await handleRegister(values);
                if (result.data.errors) {
                    switch (result.data.errors[0].field) {
                        case "name":
                            actions.setErrors({
                                nameReg: result.data.errors[0].message,
                            });
                            break;
                        case "email":
                            actions.setErrors({
                                emailReg: result.data.errors[0].message,
                            });
                            break;
                        case "password":
                            actions.setErrors({
                                passwordReg: result.data.errors[0].message,
                            });
                            break;
                        default:
                            actions.setErrors({});
                    }
                } else {
                    router.push("/");
                }
            }}
            validationSchema={RegisterSchema}
        >
            {(props: FormikProps<FormValues>) => (
                <Form>
                    <Stack spacing={3}>
                        <FormControl
                            isInvalid={
                                props.touched.nameReg && !!props.errors.nameReg
                            }
                        >
                            <FormLabel htmlFor="nameReg">Name</FormLabel>
                            <Field
                                id="nameReg"
                                name="nameReg"
                                as={ChakraInput}
                            />
                            <FormErrorMessage>
                                {props.errors.nameReg}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl
                            isInvalid={
                                props.touched.emailReg &&
                                !!props.errors.emailReg
                            }
                        >
                            <FormLabel htmlFor="emailReg">Email</FormLabel>
                            <Field
                                id="emailReg"
                                type="email"
                                name="emailReg"
                                as={ChakraInput}
                            />
                            <FormErrorMessage>
                                {props.errors.emailReg}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl
                            isInvalid={
                                props.touched.passwordReg &&
                                !!props.errors.passwordReg
                            }
                        >
                            <FormLabel htmlFor="passwordReg">
                                Password
                            </FormLabel>
                            <Field
                                id="passwordReg"
                                type="password"
                                name="passwordReg"
                                as={ChakraInput}
                            />
                            <FormErrorMessage>
                                {props.errors.passwordReg}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl
                            isInvalid={
                                props.touched.passwordConfirmationReg &&
                                !!props.errors.passwordConfirmationReg
                            }
                        >
                            <FormLabel htmlFor="passwordConformation">
                                Password Confirmation
                            </FormLabel>
                            <Field
                                id="passwordConfirmation"
                                type="password"
                                name="passwordConfirmationReg"
                                as={ChakraInput}
                            />
                            <FormErrorMessage>
                                {props.errors.passwordConfirmationReg}
                            </FormErrorMessage>
                        </FormControl>

                        <Button
                            type="submit"
                            disabled={
                                props.isSubmitting ||
                                !!props.errors.emailReg ||
                                !!props.errors.passwordReg ||
                                !!props.errors.passwordConfirmationReg
                            }
                            colorScheme="cyan"
                        >
                            Submit
                        </Button>
                    </Stack>
                </Form>
            )}
        </Formik>
    );
};

export default RegisterForm;

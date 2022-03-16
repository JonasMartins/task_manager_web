import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Stack,
    useColorMode,
} from "@chakra-ui/react";
import { Field, Form, Formik, FormikProps } from "formik";
import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import React, { ComponentProps } from "react";
import * as Yup from "yup";

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

    const router = useRouter();
    const { colorMode } = useColorMode();

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
                console.log(values);
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
                                id="_nameReg"
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
                                id="_emailReg"
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
                                id="_passwordReg"
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
                                id="_passwordConfirmation"
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
                            colorScheme="cyank"
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

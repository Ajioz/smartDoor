import * as yup from "yup";

// min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.
const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

export const registerSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters long")
    .required("Required"),
  name: yup
    .string()
    .min(3, "Username must be at least 3 characters long")
    .required("Required"),
  password: yup
    .string()
    .min(5)
    .matches(passwordRules, { message: "Please create a stronger password" })
    .required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

export const loginSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),
  password: yup.string().min(5).required("Required"),
});

export const resetSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),
});

export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(5)
    .matches(passwordRules, { message: "Please create a stronger password" })
    .required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

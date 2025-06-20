import style from "../../components/ContactForm/ContactForm.module.css";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { useId, useState, lazy, Suspense } from "react";
import * as Yup from "yup";
import type { AppDispatch } from '../../redux/store';
import { useDispatch } from "react-redux";
import { apiLogin } from "../../redux/auth/operations";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const AnimatedEyeIcon = lazy(() => import("../AnimatedEyeIcon/AnimatedEyeIcon"));

interface LoginValues {
    email: string;
    password: string;
}

const LoginSchema = Yup.object().shape({
email: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .email("Invalid email format")
    .required("Email is required!"),
password: Yup.string()
    .min(3, "Too Short!")
    .max(35, "Too Long!")
    .required("Password is required!"),
});

export default function LoginForm() {
const dispatch = useDispatch<AppDispatch>();
const emailFieldId = useId();
const passwordFieldId = useId();
const [showPassword, setShowPassword] = useState(false);
const [passwordValue, setPasswordValue] = useState("");
const navigate = useNavigate();

const handleSubmit = async (
    values: LoginValues,
    actions: FormikHelpers<LoginValues>
) => {
    try {
    await dispatch(apiLogin(values)).unwrap();
    actions.resetForm();
    toast.success("Successfully logged in!", {
        duration: 6000,
        style: {
            borderRadius: "10px",
            textAlign: "center",
        },
    });
    setTimeout(() => {
        toast("Tip: All modals can be closed by pressing Escape!", {
        icon: "🗿",
        duration: 4000,
        style: {
            borderRadius: "10px",
            textAlign: "center",
        },
        });
    }, 4000);
    } catch (error) {
    toast.error("No one has registered under this data yet!", {
        duration: 6000,
        style: {
            borderRadius: "10px",
            textAlign: "center",
        },
    });
    navigate("/register");
    }
};

return (
    <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={LoginSchema}
    >
    {({ values, handleChange }) => (
        <Form className={style.register_login_form}>
        <h2 className={style.login_register_title}>Login</h2>

        <div className={style.name_number_container}>
            <label htmlFor={emailFieldId} className={style.label}>
                Email
            </label>
            <Field
                type="email"
                name="email"
                id={emailFieldId}
                className={style.input}
            />
            <ErrorMessage
                className={style.error_message}
                name="email"
                component="span"
            />
        </div>

        <div
            className={style.name_number_container}
            style={{ position: "relative" }}
        >
            <label htmlFor={passwordFieldId} className={style.label}>
                Password
            </label>
            <input
                type={showPassword ? "text" : "password"}
                name="password"
                id={passwordFieldId}
                value={values.password}
                onChange={(e) => {
                    handleChange(e);
                    setPasswordValue(e.target.value);
            }}
                className={style.input}
            />

            {passwordValue && (
            <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={style.eye_button}
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                <Suspense fallback={null}>
                    <AnimatedEyeIcon active={showPassword} />
                </Suspense>
            </button>
            )}
            <ErrorMessage
                className={style.error_message}
                name="password"
                component="span"
            />
        </div>

        <button type="submit" className={style.button}>
            Log in
        </button>
        <p className={style.no_account_text}>Don't have any account yet?🤨</p>
        <NavLink className={style.to_register_link} to="/register">
            Register
        </NavLink>
        </Form>
    )}
    </Formik>
);
}
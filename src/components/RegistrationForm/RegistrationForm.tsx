import style from "../../components/ContactForm/ContactForm.module.css";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { useId, useState, lazy, Suspense } from "react";
import * as Yup from "yup";
import type { AppDispatch } from '../../redux/store';
import { useDispatch } from "react-redux";
import { apiRegister } from "../../redux/auth/operations";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const AnimatedEyeIcon = lazy(() => import("../AnimatedEyeIcon/AnimatedEyeIcon"));

interface RegisterFormValues {
    name: string;
    email: string;
    password: string;
}

export default function RegistrationForm() {
    const { t } = useTranslation();

    const dispatch = useDispatch<AppDispatch>();
    const nameFieldId = useId();
    const emailFieldId = useId();
    const passwordFieldId = useId();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState("");
    const navigate = useNavigate();

    const RegisterSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, t("registerPage.validation.tooShort"))
            .max(50, t("registerPage.validation.tooLong"))
            .required(t("registerPage.validation.nameRequired")),
        email: Yup.string()
            .min(3, t("registerPage.validation.tooShort"))
            .max(50, t("registerPage.validation.tooLong"))
            .email(t("registerPage.validation.invalidEmail"))
            .required(t("registerPage.validation.emailRequired")),
        password: Yup.string()
            .min(3, t("registerPage.validation.tooShort"))
            .max(35, t("registerPage.validation.tooLong"))
            .required(t("registerPage.validation.passwordRequired")),
    });

    const handleSubmit = async (
        values: RegisterFormValues,
        actions: FormikHelpers<RegisterFormValues>
    ) => {
        try {
            await dispatch(apiRegister(values)).unwrap();
            actions.resetForm();
            setPasswordValue("");
            toast.success(t("registerPage.toasts.success"), {
                duration: 6000,
                style: {
                    borderRadius: "10px",
                    textAlign: "center",
                },
            });
            setTimeout(() => {
                toast(t("registerPage.toasts.escapeTip"), {
                    icon: "🗿",
                    duration: 4000,
                    style: {
                        borderRadius: "10px",
                        textAlign: "center",
                    },
                });
            }, 4000);
        } catch (error) {
            toast.error(t("registerPage.toasts.error"), {
                duration: 6000,
                style: {
                    borderRadius: "10px",
                    textAlign: "center",
                },
            });
            navigate("/login");
        }
    };

    return (
        <Formik
            initialValues={{ name: "", email: "", password: "" }}
            onSubmit={handleSubmit}
            validationSchema={RegisterSchema}
        >
            {({ values, handleChange }) => (
                <Form className={style.register_login_form}>
                    <h2 className={style.login_register_title}>{t("registerPage.title")}</h2>

                    <div className={style.name_number_container}>
                        <label htmlFor={nameFieldId} className={style.label}>
                            {t("registerPage.labels.name")}
                        </label>
                        <Field
                            type="text"
                            name="name"
                            id={nameFieldId}
                            className={style.input}
                        />
                        <ErrorMessage
                            className={style.error_message}
                            name="name"
                            component="span"
                        />
                    </div>

                    <div className={style.name_number_container}>
                        <label htmlFor={emailFieldId} className={style.label}>
                            {t("registerPage.labels.email")}
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

                    <div className={style.name_number_container} style={{ position: "relative" }}>
                        <label htmlFor={passwordFieldId} className={style.label}>
                            {t("registerPage.labels.password")}
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
                                aria-label={showPassword ? t("form.hidePassword") : t("form.showPassword")}
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
                        {t("registerPage.buttons.submit")}
                    </button>
                    <p className={style.no_account_text}>{t("registerPage.text.haveAccount")}</p>
                    <NavLink className={style.to_register_link} to="/login">
                        {t("registerPage.text.loginLink")}
                    </NavLink>
                </Form>
            )}
        </Formik>
    );
}
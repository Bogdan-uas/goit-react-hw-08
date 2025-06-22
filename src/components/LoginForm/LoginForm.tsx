import style from "../../components/ContactForm/ContactForm.module.css";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { useId, useState, lazy, Suspense } from "react";
import * as Yup from "yup";
import type { AppDispatch } from '../../redux/store';
import { useDispatch } from "react-redux";
import { apiLogin } from "../../redux/auth/operations";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const AnimatedEyeIcon = lazy(() => import("../AnimatedEyeIcon/AnimatedEyeIcon"));

interface LoginValues {
  email: string;
  password: string;
}

export default function LoginForm() {
    const { t } = useTranslation();

    const dispatch = useDispatch<AppDispatch>();
    const emailFieldId = useId();
    const passwordFieldId = useId();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState("");
    const navigate = useNavigate();

    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .min(3, t("loginPage.validation.tooShort"))
            .max(50, t("loginPage.validation.tooLong"))
            .email(t("loginPage.validation.invalidEmail"))
            .required(t("loginPage.validation.emailRequired")),
        password: Yup.string()
            .min(3, t("loginPage.validation.tooShort"))
            .max(35, t("loginPage.validation.tooLong"))
            .required(t("loginPage.validation.passwordRequired")),
    });

    const handleSubmit = async (
        values: LoginValues,
        actions: FormikHelpers<LoginValues>
    ) => {
        try {
            await dispatch(apiLogin(values)).unwrap();
            actions.resetForm();
            toast.success(t("loginPage.toasts.loginSuccess"), {
                duration: 6000,
                style: { borderRadius: "10px", textAlign: "center" },
            });
            setTimeout(() => {
                toast(t("loginPage.toasts.escapeTip"), {
                    icon: "🗿",
                    duration: 4000,
                    style: { borderRadius: "10px", textAlign: "center" },
                });
            }, 4000);
        } catch (error) {
            toast.error(t("loginPage.toasts.loginFail"), {
                duration: 6000,
                style: { borderRadius: "10px", textAlign: "center" },
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
                    <h2 className={style.login_register_title}>{t("loginPage.title")}</h2>

                    <div className={style.name_number_container}>
                        <label htmlFor={emailFieldId} className={style.label}>
                            {t("loginPage.labels.email")}
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
                            {t("loginPage.labels.password")}
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
                                aria-label={
                                    showPassword
                                        ? t("loginPage.form.hidePassword")
                                        : t("loginPage.form.showPassword")
                                }
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
                        {t("loginPage.buttons.submit")}
                    </button>
                    <p className={style.no_account_text}>{t("loginPage.text.noAccount")}</p>
                    <NavLink className={style.to_register_link} to="/register">
                        {t("loginPage.text.registerLink")}
                    </NavLink>
                </Form>
            )}
        </Formik>
    );
}
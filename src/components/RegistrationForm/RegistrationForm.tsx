import style from "../../components/ContactForm/ContactForm.module.css";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { useState, lazy, Suspense } from "react";
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
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const toastConfig = (type: "success" | "error", message: string, duration = 6000) =>
        toast[type](message, {
            duration,
            style: { borderRadius: "10px", textAlign: "center" },
        });

    const initialValues: RegisterFormValues = { name: "", email: "", password: "" };

    const validationSchema = Yup.object({
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
            toastConfig("success", t("registerPage.toasts.success"));

            setTimeout(() => {
                toast(t("registerPage.toasts.escapeTip"), {
                    icon: "🗿",
                    duration: 4000,
                    style: { borderRadius: "10px", textAlign: "center" },
                });
            }, 4000);
        } catch {
            toastConfig("error", t("registerPage.toasts.error"));
            navigate("/login");
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, handleChange }) => (
                <Form className={style.register_login_form}>
                    <h2 className={style.login_register_title}>{t("registerPage.title")}</h2>

                    {["name", "email"].map((field) => (
                        <div key={field} className={style.name_number_container}>
                            <label htmlFor={field} className={style.label}>
                                {t(`registerPage.labels.${field}`)}
                            </label>
                            <Field type={field === "email" ? "email" : "text"} name={field} id={field} className={style.input} />
                            <ErrorMessage className={style.error_message} name={field} component="span" />
                        </div>
                    ))}

                    <div className={style.name_number_container} style={{ position: "relative" }}>
                        <label htmlFor="password" className={style.label}>
                            {t("registerPage.labels.password")}
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            value={values.password}
                            onChange={handleChange}
                            className={style.input}
                        />
                        {values.password && (
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
                        <ErrorMessage className={style.error_message} name="password" component="span" />
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
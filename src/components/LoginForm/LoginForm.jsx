import style from "../../components/ContactForm/ContactForm.module.css";
import css from './LoginForm.module.css'
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useId } from "react";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { apiLogin } from "../../redux/auth/operations";

const LoginSchema = Yup.object().shape({
    email: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("Email is required!"),
    password: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("Password is required!"),
});

export default function LoginForm() {
    const dispatch = useDispatch();
    const emailFieldId = useId();
    const passwordFieldId = useId();

    const handleSubmit = (values, { resetForm }) => {
        dispatch(apiLogin(values));
        resetForm();
        console.log(values)
    };

    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={handleSubmit}
            validationSchema={LoginSchema}
        >
            <Form className={style.form}>
                <h2 className={css.login_register_title}>Login</h2>
                <div className={style.name_number_container}>
                    <label htmlFor={emailFieldId} className={style.label}>Email</label>
                    <Field type="email" name="email" id={emailFieldId} className={style.input} />
                    <ErrorMessage className={style.error_message} name="email" component="span" />
                </div>
                <div className={style.name_number_container}>
                    <label htmlFor={passwordFieldId} className={style.label}>Password</label>
                    <Field type="password" name="password" id={passwordFieldId} className={style.input} />
                    <ErrorMessage className={style.error_message} name="password" component="span" />
                </div>
                <button type="submit" className={style.button}>Log in</button>
            </Form>
        </Formik>
    );
}
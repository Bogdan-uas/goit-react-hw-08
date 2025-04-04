import style from "../../components/ContactForm/ContactForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useId } from "react";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { apiRegister } from "../../redux/auth/operations";

const RegisterSchema = Yup.object().shape({
    name: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("Username is required!"),
    email: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("Email is required!"),
    password: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("Password is required!"),
});

export default function RegistrationForm() {
    const dispatch = useDispatch();
    const nameFieldId = useId();
    const emailFieldId = useId();
    const passwordFieldId = useId();

    const handleSubmit = (values, { resetForm }) => {
        dispatch(apiRegister(values));
        resetForm();
        console.log(values)
    };

    return (
        <Formik
            initialValues={{ name: "", email: "", password: "" }}
            onSubmit={handleSubmit}
            validationSchema={RegisterSchema}
        >
            <Form className={style.form}>
                <h2 className={css.login_register_title}>Register User</h2>
                <div className={style.name_number_container}>
                    <label htmlFor={nameFieldId} className={style.label}>Name</label>
                    <Field type="name" name="name" id={nameFieldId} className={style.input} />
                    <ErrorMessage className={style.error_message} name="name" component="span" />
                </div>
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
                <button type="submit" className={style.button}>Sign up</button>
            </Form>
        </Formik>
    );
}
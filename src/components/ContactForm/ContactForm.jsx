import style from "./ContactForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useId } from "react";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { addContact } from "../../redux/contactsOps.js";

const FeedbackSchema = Yup.object().shape({
    name: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("Required"),
    number: Yup.string().min(9, "Must be a valid number!").required("Required"),
});

export default function ContactForm() {
    const dispatch = useDispatch();
    const nameFieldId = useId();
    const numberFieldId = useId();

    const handleSubmit = (values, { resetForm }) => {
        dispatch(addContact(values));
        resetForm();
    };

    return (
        <Formik
            initialValues={{ name: "", number: "" }}
            onSubmit={handleSubmit}
            validationSchema={FeedbackSchema}
        >
            <Form className={style.form}>
                <div className={style.name_number_container}>
                    <label htmlFor={nameFieldId} className={style.label}>Name</label>
                    <Field type="text" name="name" id={nameFieldId} className={style.input} />
                    <ErrorMessage className={style.error_message} name="name" component="span" />
                </div>
                <div className={style.name_number_container}>
                    <label htmlFor={numberFieldId} className={style.label}>Number</label>
                    <Field type="text" name="number" id={numberFieldId} className={style.input} />
                    <ErrorMessage className={style.error_message} name="number" component="span" />
                </div>
                <button type="submit" className={style.button}>Add contact</button>
            </Form>
        </Formik>
    );
}

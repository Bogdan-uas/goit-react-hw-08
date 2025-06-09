import style from "./ContactForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useId } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addContact } from "../../redux/contacts/operations.js";
import { selectIsModalOpen, selectIsEditingGlobal } from "../../redux/ui/selectors";

const FeedbackSchema = Yup.object().shape({
    name: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("Required"),
    number: Yup.string().min(9, "Must be a valid number!").required("Required"),
});

export default function ContactForm() {
    const dispatch = useDispatch();
    const isModalOpen = useSelector(selectIsModalOpen);
    const isEditingGlobal = useSelector(selectIsEditingGlobal);
    const isLocked = isModalOpen || isEditingGlobal;

    const nameFieldId = useId();
    const numberFieldId = useId();

    const handleSubmit = (values, actions) => {
        if (isLocked) {
            toast.error(
                isModalOpen
                    ? "Close the modal first."
                    : "You can't add while editing.",
                {
                    duration: 4000,
                    style: { borderRadius: "10px", textAlign: "center" },
                }
            );
            return;
        }

        dispatch(addContact(values));
        toast.success("Successfully added a contact!", {
            duration: 4000,
            style: { borderRadius: "10px", textAlign: "center" },
        });
        actions.resetForm();
    };

    return (
        <Formik
            initialValues={{ name: "", number: "" }}
            validationSchema={FeedbackSchema}
            onSubmit={handleSubmit}
        >
            {({ handleSubmit }) => (
                <Form className={style.form} onSubmit={handleSubmit}>
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

                    <button
                        type="submit"
                        className={`${style.button} ${isLocked ? style.disabled : ""}`}
                        onClick={(e) => {
                            if (isLocked) {
                                e.preventDefault();
                                toast.error(
                                    isModalOpen
                                        ? "Close the modal first."
                                        : "You can't add while editing.",
                                    {
                                        duration: 4000,
                                        style: { borderRadius: "10px", textAlign: "center" },
                                    }
                                );
                            }
                        }}
                    >
                        Add contact
                    </button>
                </Form>
            )}
        </Formik>
    );
}
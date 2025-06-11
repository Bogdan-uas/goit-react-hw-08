import style from "./ContactForm.module.css";
import css from "../Contact/Contact.module.css"
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useId } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { selectContacts } from "../../redux/contacts/selectors";
import toast from "react-hot-toast";
import { useState } from "react";
import { addContact, deleteAllContacts } from "../../redux/contacts/operations.js";
import { selectIsModalOpen, selectIsEditingGlobal } from "../../redux/ui/selectors";
import { openModal, closeModal } from "../../redux/ui/modalSlice";

const FeedbackSchema = Yup.object().shape({
    name: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("Required"),
    number: Yup.string().min(9, "Must be a valid number!").required("Required"),
});

export default function ContactForm() {
    const dispatch = useDispatch();
    const isModalOpen = useSelector(selectIsModalOpen);
    const isEditingGlobal = useSelector(selectIsEditingGlobal);
    const isLocked = isModalOpen || isEditingGlobal;
    const contacts = useSelector(selectContacts);
    const hasContacts = contacts.length > 0; 
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

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

const handleDeleteAllConfirm = () => {
    dispatch(deleteAllContacts())
        .unwrap()
        .then(() => {
            toast.success("All contacts deleted!", {
                duration: 4000,
                style: { borderRadius: "10px", textAlign: "center" },
            });
            dispatch(closeModal());
            setShowDeleteAllModal(false);
        })
        .catch((error) => {
            toast.error("Failed to delete all contacts.", {
                duration: 4000,
                style: { borderRadius: "10px", textAlign: "center" },
            });
        });
};

return (
    <div className={style.main_container}>
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

    {hasContacts && (
        <button
            type="button"
            className={`${css.delete_button} ${style.delete_button} ${isLocked ? style.disabled : ""}`}
            disabled={isLocked}
            onClick={() => {
            if (isLocked) {
                toast.error(
                isModalOpen ? "Close the modal first." : "You can't delete while editing.",
                {
                    duration: 4000,
                    style: { borderRadius: "10px", textAlign: "center" },
                }
            );
            } else {
                dispatch(openModal());
                setShowDeleteAllModal(true);
            }
        }}
        >
            Delete all contacts
        </button>
    )}

    {showDeleteAllModal && (
        <div className={css.confirm_modal}>
        <p className={css.info_text}>
        Are you sure you want to delete <b>ALL</b> contacts?
        </p>
        <span className={css.info_text}>
            You won't be able to restore them!
        </span>
        <div className={css.deletion_confirmation_button_group}>
            <button
                className={css.save_button}
                onClick={() => {
                    dispatch(closeModal())
                    setShowDeleteAllModal(false)
                }
                }
            >
                Cancel
            </button>
            <button
                className={css.cancel_button}
                onClick={handleDeleteAllConfirm}
            >
                Confirm
            </button>
        </div>
        </div>
    )}
    </div>
);
}

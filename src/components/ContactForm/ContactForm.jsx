import style from "./ContactForm.module.css";
import css from "../Contact/Contact.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useId, useRef, useEffect, useState } from "react";
import * as Yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useDispatch, useSelector } from "react-redux";
import { selectContacts } from "../../redux/contacts/selectors";
import toast from "react-hot-toast";
import { addContact, deleteAllContacts } from "../../redux/contacts/operations";
import { selectIsModalOpen, selectIsEditingGlobal } from "../../redux/ui/selectors";
import { openModal, closeModal } from "../../redux/ui/modalSlice";

const initialValues = {
    name: "",
    number: ""
};

const FeedbackSchema = Yup.object().shape({
    name: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("Required"),
    number: Yup.string().min(9, "Must be a valid number!").required("Required"),
});

const normalizeIntlNumber = (number) => {
    const parsed = parsePhoneNumberFromString(number);
    return parsed ? parsed.number : number;
};

export default function ContactForm() {
    const dispatch = useDispatch();
    const isModalOpen = useSelector(selectIsModalOpen);
    const isEditingGlobal = useSelector(selectIsEditingGlobal);
    const isLocked = isModalOpen || isEditingGlobal;
    const contacts = useSelector(selectContacts);
    const hasContacts = contacts.length > 0;
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

    const deleteAllButtonRef = useRef(null);
    const modalRef = useRef(null);

    const nameFieldId = useId();
    const numberFieldId = useId();

    const handleSubmit = (values, actions) => {
        if (isLocked) {
            toast.error(
                isModalOpen ? "Close the modal first." : "You can't add while editing.",
                {
                    duration: 4000,
                    style: { borderRadius: "10px", textAlign: "center" },
                }
            );
            return;
        }

        const inputName = values.name.trim().toLowerCase();
        const inputNumber = normalizeIntlNumber(values.number);

        const isExactDuplicate = contacts.some(contact =>
            contact.name.trim().toLowerCase() === inputName &&
            normalizeIntlNumber(contact.number) === inputNumber
        );

        const isNumberDuplicate = contacts.some(contact =>
            normalizeIntlNumber(contact.number) === inputNumber
        );

        if (isExactDuplicate) {
            toast.error("You can't create a contact with identical data", {
                duration: 5000,
                style: { borderRadius: "10px", textAlign: "center" },
            });
            return;
        }

        dispatch(addContact(values));

        if (isNumberDuplicate) {
            toast("Warning: A contact with this phone number already exists! (A contact was still successfully added!)", {
                icon: "❗",
                duration: 8000,
                style: { borderRadius: "10px", textAlign: "center" },
            });
        } else {
            toast.success("Successfully added a contact!", {
                duration: 4000,
                style: { borderRadius: "10px", textAlign: "center" },
            });
        }

        actions.resetForm();
    };

    const cancelDeleteAll = () => {
        dispatch(closeModal());
        setShowDeleteAllModal(false);
        if (deleteAllButtonRef.current) {
            deleteAllButtonRef.current.focus();
        }
    };

    const confirmDeleteAll = () => {
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
            .catch(() => {
                toast.error("Failed to delete all contacts.", {
                    duration: 4000,
                    style: { borderRadius: "10px", textAlign: "center" },
                });
            });
    };

    useEffect(() => {
        if (!showDeleteAllModal) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                cancelDeleteAll();
            } else if (e.key === "Enter") {
                e.preventDefault();
                confirmDeleteAll();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showDeleteAllModal]);

    return (
        <div className={style.main_container}>
            <Formik
                initialValues={initialValues}
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
                                            ? "Close the current modal before adding another contact!"
                                            : "You can't add another contact while editing!",
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
                    ref={deleteAllButtonRef}
                    type="button"
                    className={`${css.delete_button} ${style.delete_button} ${isLocked ? style.disabled : ""}`}
                    onClick={() => {
                        if (isLocked) {
                            toast.error(
                                isModalOpen
                                    ? "Close the current modal before deleting all contacts!"
                                    : "You can't delete all contacts while editing!",
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
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="deleteAllTitle"
                    tabIndex={-1}
                    ref={modalRef}
                    className={css.confirm_modal}
                >
                    <p id="deleteAllTitle" className={css.info_text}>
                        Are you sure you want to delete <b>ALL</b> contacts?
                    </p>
                    <span className={css.info_text}>
                        You won't be able to restore them!
                    </span>
                    <div className={css.deletion_confirmation_button_group}>
                        <button className={css.save_button} onClick={cancelDeleteAll}>
                            Cancel
                        </button>
                        <button className={css.cancel_button} onClick={confirmDeleteAll}>
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

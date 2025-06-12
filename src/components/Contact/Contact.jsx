import style from "./Contact.module.css";
import { BsPersonFill, BsTelephoneFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { deleteContact, updateContact } from "../../redux/contacts/operations.js";
import { openModal, closeModal } from "../../redux/ui/modalSlice.js";
import { startEditing, stopEditing } from "../../redux/ui/editSlice.js";
import { selectIsModalOpen, selectIsEditingGlobal, selectEditingId } from "../../redux/ui/selectors.js";
import { useState } from "react";

const contactSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, "Too short!")
        .max(50, "Too long!")
        .required("Name is required"),
    number: Yup.string()
        .matches(/^\+?[0-9\s-]{3,}$/, "Invalid number format")
        .min(9, "Must remain a valid number!")
        .required("Number is required"),
});

export default function Contact({ contact, contactIdToDelete, setContactIdToDelete }) {
    const dispatch = useDispatch();
    const [editedName, setEditedName] = useState(contact.name);
    const [editedNumber, setEditedNumber] = useState(contact.number);
    const [isEmptyDeleteModalOpen, setIsEmptyDeleteModalOpen] = useState(false);

    const isAnyModalOpen = useSelector(selectIsModalOpen);
    const isEditingGlobal = useSelector(selectIsEditingGlobal);
    const globalEditingId = useSelector(selectEditingId);
    const isEditing = globalEditingId === contact.id;
    const isDeletionModalOpen = contactIdToDelete === contact.id;

    const handleDeleteClick = () => {
        dispatch(openModal());
        setContactIdToDelete(contact.id);
    };

    const confirmDelete = () => {
        dispatch(deleteContact(contact.id));
        toast.success("Successfully deleted a contact!", {
            duration: 4000,
            style: { borderRadius: "10px", textAlign: "center" },
        });
        dispatch(closeModal());
        setContactIdToDelete(null);
    };

    const cancelDelete = () => {
        dispatch(closeModal());
        setContactIdToDelete(null);
    };

    const onSave = async () => {
        const trimmedName = editedName.trim();
        const trimmedNumber = editedNumber.trim();

        if (trimmedName === "" && trimmedNumber === "") {
            dispatch(openModal());
            setIsEmptyDeleteModalOpen(true);
            return;
        }

        if (trimmedName === contact.name && trimmedNumber === contact.number) {
            toast("Nothing to change!", {
                icon: "❗",
                duration: 4000,
                style: { borderRadius: "10px", textAlign: "center" },
            });
            return;
        }

        try {
            await contactSchema.validate(
                { name: trimmedName, number: trimmedNumber },
                { abortEarly: false }
            );

            dispatch(updateContact({
                contactId: contact.id,
                updates: {
                    name: trimmedName,
                    number: trimmedNumber,
                },
            }))
                .unwrap()
                .then(() => {
                    toast.success("Contact successfully updated!", {
                        duration: 4000,
                        style: { borderRadius: "10px", textAlign: "center" },
                    });
                    dispatch(stopEditing());
                });
        } catch (err) {
            if (err.inner) {
                err.inner.forEach((validationError) => {
                    toast.error(validationError.message, {
                        duration: 4000,
                        style: { borderRadius: "10px", textAlign: "center" },
                    });
                });
            }
        }
    };

    return (
        <div className={style.container}>
            <div className={style.info_container_container}>
                <div className={style.info_container}>
                    <BsPersonFill className={style.svg} size={18} />
                    {isEditing ? (
                        <input
                            className={style.edit_input}
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            placeholder="(Edited Name)"
                        />
                    ) : (
                        <p className={style.info_text}>{contact.name}</p>
                    )}
                </div>
                <div className={style.info_container}>
                    <BsTelephoneFill className={style.svg} size={16} />
                    {isEditing ? (
                        <input
                            className={style.edit_input}
                            value={editedNumber}
                            onChange={(e) => setEditedNumber(e.target.value)}
                            placeholder="(Edited Number)"
                        />
                    ) : (
                        <p className={style.info_text}>{contact.number}</p>
                    )}
                </div>
            </div>

            <div className={style.button_group}>
                {isEditing ? (
                    <>
                        <button
                            className={`${style.cancel_button} ${isAnyModalOpen ? style.disabled : ""}`}
                            onClick={() => {
                                setEditedName(contact.name);
                                setEditedNumber(contact.number);
                                dispatch(stopEditing());
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className={`${style.save_button} ${isAnyModalOpen ? style.disabled : ""}`}
                            onClick={onSave}
                        >
                            Save
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className={`${style.delete_button} ${(isAnyModalOpen || isEditingGlobal) ? style.disabled : ""}`}
                            onClick={(e) => {
                                if (isAnyModalOpen || isEditingGlobal) {
                                    e.preventDefault();
                                    toast.error(
                                        isAnyModalOpen
                                            ? "Close the current modal before deleting a contact!"
                                            : "You can't delete another contact while editing one!",
                                        {
                                            duration: 4000,
                                            style: { borderRadius: "10px", textAlign: "center" },
                                        }
                                    );
                                } else {
                                    handleDeleteClick();
                                }
                            }}
                        >
                            Delete
                        </button>
                        <button
                            className={`${style.edit_button} ${(isAnyModalOpen || isEditingGlobal) ? style.disabled : ""}`}
                            onClick={(e) => {
                                if (isAnyModalOpen || isEditingGlobal) {
                                    e.preventDefault();
                                    toast.error(
                                        isAnyModalOpen
                                            ? "Close the current modal before starting editing a contact!"
                                            : "You can't edit another contact while editing one!",
                                        {
                                            duration: 4000,
                                            style: { borderRadius: "10px", textAlign: "center" },
                                        }
                                    );
                                } else {
                                    dispatch(startEditing(contact.id));
                                }
                            }}
                        >
                            Edit
                        </button>
                    </>
                )}
            </div>

            {isDeletionModalOpen && (
                <div className={style.confirm_modal}>
                    <p className={style.info_text}>
                        Are you sure you want to delete{" "}
                        <b className={style.info_text}>{contact.name}</b>?
                    </p>
                    <div className={style.deletion_confirmation_button_group}>
                        <button className={style.save_button} onClick={cancelDelete}>
                            Cancel
                        </button>
                        <button className={style.cancel_button} onClick={confirmDelete}>
                            Confirm
                        </button>
                    </div>
                </div>
            )}
            
            {isEmptyDeleteModalOpen && (
                <div className={style.confirm_modal}>
                    <p className={style.info_text}>
                        Both fields are empty. Do you want to <b>delete</b> this contact?
                    </p>
                    <div className={style.deletion_confirmation_button_group}>
                        <button
                            className={style.save_button}
                            onClick={() => {
                                setEditedName(contact.name);
                                setEditedNumber(contact.number);
                                dispatch(closeModal());
                                setIsEmptyDeleteModalOpen(false);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className={style.cancel_button}
                            onClick={() => {
                                dispatch(deleteContact(contact.id));
                                toast.success("Contact deleted! (fields were empty)", {
                                    duration: 4000,
                                    style: { borderRadius: "10px", textAlign: "center" },
                                });
                                dispatch(closeModal());
                                setIsEmptyDeleteModalOpen(false);
                                dispatch(stopEditing());
                            }}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

import style from "./Contact.module.css";
import { BsPersonFill, BsTelephoneFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { deleteContact, updateContact } from "../../redux/contacts/operations.js";
import { openModal, closeModal } from "../../redux/ui/modalSlice.js";
import { startEditing, stopEditing } from "../../redux/ui/editSlice.js";
import { selectIsModalOpen, selectIsEditingGlobal } from "../../redux/ui/selectors.js";
import { useState } from "react";

const contactSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, "Too short!")
        .max(50, "Too long!")
        .required("Name is required"),
    number: Yup.string()
        .matches(/^\+?[0-9\s-]{3,}$/, "Invalid number format")
        .min(9, "Must be a valid number!")
        .required("Number is required"),
});

export default function Contact({
    contact,
    editingId,
    setEditingId,
    contactIdToDelete,
    setContactIdToDelete,
}) {
    const dispatch = useDispatch();
    const [editedName, setEditedName] = useState(contact.name);
    const [editedNumber, setEditedNumber] = useState(contact.number);

    const isAnyModalOpen = useSelector(selectIsModalOpen);
    const isEditingGlobal = useSelector(selectIsEditingGlobal);
    const isEditing = editingId === contact.id;
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
        if (
            editedName.trim() === contact.name &&
            editedNumber.trim() === contact.number
        ) {
            toast("Nothing to change!", {
                icon: "❗",
                duration: 4000,
                style: { borderRadius: "10px", textAlign: "center" },
            });
            return;
        }

        try {
            await contactSchema.validate(
                { name: editedName.trim(), number: editedNumber.trim() },
                { abortEarly: false }
            );

            dispatch(updateContact({
                contactId: contact.id,
                updates: {
                    name: editedName.trim(),
                    number: editedNumber.trim(),
                },
            }))
                .unwrap()
                .then(() => {
                    toast.success("Contact successfully updated!", {
                        duration: 4000,
                        style: { borderRadius: "10px", textAlign: "center" },
                    });
                    setEditingId(null);
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
                                setEditingId(null);
                                setEditedName(contact.name);
                                setEditedNumber(contact.number);
                                dispatch(stopEditing());
                            }}
                            disabled={isAnyModalOpen}
                        >
                            Cancel
                        </button>
                        <button
                            className={`${style.save_button} ${isAnyModalOpen ? style.disabled : ""}`}
                            onClick={onSave}
                            disabled={isAnyModalOpen}
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
                                            ? "Close the modal first."
                                            : "You can't delete while editing.",
                                        {
                                            duration: 4000,
                                            style: {
                                                borderRadius: "10px",
                                                textAlign: "center",
                                            },
                                        }
                                    );
                                } else {
                                    handleDeleteClick();
                                }
                            }}
                            disabled={isAnyModalOpen}
                        >
                            Delete
                        </button>
                        <button
                            className={`${style.edit_button} ${(isAnyModalOpen || isEditingGlobal) ? style.disabled : ""}`}
                            onClick={(e) => {
                                if (isAnyModalOpen || (editingId && editingId !== contact.id)) {
                                    e.preventDefault();
                                    toast.error("You can only edit one contact at a time.", {
                                        duration: 4000,
                                        style: {
                                            borderRadius: "10px",
                                            textAlign: "center",
                                        },
                                    });
                                } else {
                                    setEditingId(contact.id);
                                    dispatch(startEditing(contact.id));
                                }
                            }}
                            disabled={isAnyModalOpen}
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
                        <button
                            className={style.save_button}
                            onClick={cancelDelete}
                        >
                            Cancel
                        </button>
                        <button
                            className={style.cancel_button}
                            onClick={confirmDelete}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
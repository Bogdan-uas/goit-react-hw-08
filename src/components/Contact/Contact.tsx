import React, { useState, useRef, useEffect } from "react";
import style from "./Contact.module.css";
import { BsPersonFill, BsTelephoneFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import type { AppDispatch } from '../../redux/store'; 
import { deleteContact, updateContact } from "../../redux/contacts/operations.js";
import { openModal, closeModal } from "../../redux/ui/modalSlice.js";
import { startEditing, stopEditing, setUnsavedChanges } from "../../redux/ui/editSlice.js";
import {
    selectIsModalOpen,
    selectIsEditingGlobal,
    selectEditingId,
} from "../../redux/ui/selectors.js";

interface ContactProps {
contact: {
    id: string;
    name: string;
    number: string;
};
contactIdToDelete: string | null;
setContactIdToDelete: React.Dispatch<React.SetStateAction<string | null>>;
}

const contactSchema = Yup.object().shape({
name: Yup.string().min(3, "Too short!").max(50, "Too long!").required("Name is required"),
number: Yup.string()
    .matches(/^\+?[0-9\s-]{3,}$/, "Invalid number format")
    .min(9, "Must remain a valid number!")
    .required("Number is required"),
});

export default function Contact({
    contact,
    contactIdToDelete,
    setContactIdToDelete,
}: ContactProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [editedName, setEditedName] = useState(contact.name);
    const [editedNumber, setEditedNumber] = useState(contact.number);
    const [isEmptyDeleteModalOpen, setIsEmptyDeleteModalOpen] = useState(false);
    const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);

    const nameInputRef = useRef<HTMLInputElement | null>(null);

    const isAnyModalOpen = useSelector(selectIsModalOpen);
    const isEditingGlobal = useSelector(selectIsEditingGlobal);
    const globalEditingId = useSelector(selectEditingId);

    const isEditing = globalEditingId === contact.id;
    const isDeletionModalOpen = contactIdToDelete === contact.id;

    const hasChanges = () => editedName.trim() !== contact.name || editedNumber.trim() !== contact.number;

    const validateNumberInput = (value: string) => /^[0-9+\-\s]*$/.test(value);

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
            await contactSchema.validate({ name: trimmedName, number: trimmedNumber }, { abortEarly: false });

            let formattedNumber = trimmedNumber;
            const parsedPhone = parsePhoneNumberFromString(trimmedNumber, "US");
            if (parsedPhone?.isValid()) {
                formattedNumber = parsedPhone.format("E.164");
            }

            dispatch(
                updateContact({
                    contactId: contact.id,
                    updates: { name: trimmedName, number: formattedNumber },
                })
            )
                .unwrap()
                .then(() => {
                    toast.success("Contact successfully updated!", {
                        duration: 4000,
                        style: { borderRadius: "10px", textAlign: "center" },
                    });
                    dispatch(stopEditing());
                    dispatch(setUnsavedChanges(false));
                });
        } catch (err: any) {
            if (err.inner) {
                err.inner.forEach((validationError: any) => {
                    toast.error(validationError.message, {
                        duration: 4000,
                        style: { borderRadius: "10px", textAlign: "center" },
                    });
                });
            }
        }
    };

    useEffect(() => {
        if (isEditing && nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, [isEditing]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (isDeletionModalOpen) {
                    cancelDelete();
                } else if (isEmptyDeleteModalOpen) {
                    setEditedName(contact.name);
                    setEditedNumber(contact.number);
                    dispatch(closeModal());
                    setIsEmptyDeleteModalOpen(false);
                } else if (isEditing && showExitConfirmModal) {
                    dispatch(closeModal());
                    setShowExitConfirmModal(false);
                } else if (isEditing) {
                    if (hasChanges()) {
                        dispatch(openModal());
                        setShowExitConfirmModal(true);
                    } else {
                        dispatch(stopEditing());
                    }
                }
            }

            if (e.key === "Enter") {
                if (isDeletionModalOpen) {
                    confirmDelete();
                } else if (isEmptyDeleteModalOpen) {
                    dispatch(deleteContact(contact.id));
                    toast.success("Contact deleted! (fields were empty)");
                    dispatch(closeModal());
                    setIsEmptyDeleteModalOpen(false);
                    dispatch(stopEditing());
                } else if (isEditing && showExitConfirmModal) {
                    setEditedName(contact.name);
                    setEditedNumber(contact.number);
                    dispatch(stopEditing());
                    dispatch(setUnsavedChanges(false));
                    dispatch(closeModal());
                    setShowExitConfirmModal(false);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [
        isEditing,
        editedName,
        editedNumber,
        isDeletionModalOpen,
        isEmptyDeleteModalOpen,
        showExitConfirmModal,
        contact.name,
        contact.number,
        dispatch,
    ]);

    useEffect(() => {
        const hasChanged = editedName.trim() !== contact.name || editedNumber.trim() !== contact.number;
        dispatch(setUnsavedChanges(isEditing && hasChanged));
    }, [editedName, editedNumber, isEditing, contact.name, contact.number, dispatch]);

    useEffect(() => {
        if (!isEditing) {
            setEditedName(contact.name);
            setEditedNumber(contact.number);
        }
    }, [isEditing, contact.name, contact.number]);

    return (
        <div className={style.container}>
            <div className={style.info_container_container}>
                <div className={style.info_container}>
                    <BsPersonFill className={style.svg} size={18} />
                    {isEditing ? (
                        <input
                            ref={nameInputRef}
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
                            onChange={(e) => {
                                const val = e.target.value;
                                if (validateNumberInput(val)) {
                                    setEditedNumber(val);
                                } else {
                                    toast.error(
                                        "Invalid character in phone number! Only digits, +, -, and spaces allowed.",
                                        {
                                            duration: 6000,
                                            style: {
                                                borderRadius: "10px",
                                                textAlign: "center",
                                            },
                                        }
                                    );
                                }
                            }}
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
                                if (editedName.trim() === "" && editedNumber.trim() === "") {
                                    setEditedName(contact.name);
                                    setEditedNumber(contact.number);
                                    dispatch(stopEditing());
                                    dispatch(setUnsavedChanges(false));
                                } else if (hasChanges()) {
                                    dispatch(openModal());
                                    setShowExitConfirmModal(true);
                                } else {
                                    dispatch(closeModal());
                                    dispatch(stopEditing());
                                }
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
                                    dispatch(openModal());
                                    setContactIdToDelete(contact.id);
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
                        Are you sure you want to delete <b>{contact.name}</b>?
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
            )
            }

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
                                dispatch(stopEditing());
                                dispatch(setUnsavedChanges(false));
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

            {showExitConfirmModal && (
                <div className={style.confirm_modal}>
                    <p className={style.info_text}>
                        You have unsaved changes. Are you sure you want to exit without saving?
                    </p>
                    <div className={style.deletion_confirmation_button_group}>
                        <button
                            className={style.save_button}
                            onClick={() => {
                                setShowExitConfirmModal(false);
                                dispatch(closeModal());
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className={style.cancel_button}
                            onClick={() => {
                                setEditedName(contact.name);
                                setEditedNumber(contact.number);
                                dispatch(stopEditing());
                                dispatch(setUnsavedChanges(false));
                                dispatch(closeModal());
                                setShowExitConfirmModal(false);
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
import style from "./Contact.module.css";
import { BsPersonFill, BsTelephoneFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import toast from 'react-hot-toast';
import * as Yup from "yup";
import { deleteContact, updateContact } from "../../redux/contacts/operations.js";
import { useState } from "react";

const contactSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, "Too short!")
        .max(50, "Too long!")
        .required("Name is required"),
    number: Yup.string()
        .matches(/^\+?[0-9\s-]{3,}$/, "Invalid number format")
        .required("Number is required"),
});

export default function Contact({ contact }) {
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(contact.name);
    const [editedNumber, setEditedNumber] = useState(contact.number);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const handleDeleteClick = () => {
        setShowConfirmDelete(true);
    };

    const confirmDelete = () => {
        dispatch(deleteContact(contact.id));
        toast.success("Successfully deleted", {
            duration: 4000,
            style: { borderRadius: "10px" },
        });
        setShowConfirmDelete(false);
    };
    
    const cancelDelete = () => {
        setShowConfirmDelete(false);
    };

    const onSave = async () => {
        if (
        editedName.trim() === contact.name &&
        editedNumber.trim() === contact.number
        ) {
        toast("Nothing to change!", {
            icon: "❗",
            duration: 4000,
            style: {
                borderRadius: "10px"
            },
        });
            setIsEditing(false);
            return;
        }
    
        try {
        await contactSchema.validate(
            {
                name: editedName.trim(),
                number: editedNumber.trim(),
            },
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
            toast.success("Contact updated!", {
                duration: 4000,
                style: {
                    borderRadius: "10px"
                },
                });
                setIsEditing(false);
            });
        } catch (err) {
        if (err.inner) {
            err.inner.forEach((validationError) => {
            toast.error(validationError.message, {
                duration: 4000,
                style: {
                    borderRadius: "10px"
                },
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
                            className={style.cancel_button}
                            onClick={() => {
                                setIsEditing(false);
                                setEditedName(contact.name);
                                setEditedNumber(contact.number);
                            }}
                        >
                            Cancel
                        </button>
                        <button className={style.save_button} onClick={onSave}>Save</button>
                    </>
                ) : (
                    <>
                        <button className={style.delete_button} onClick={handleDeleteClick}>
                            Delete
                        </button>
                        <button className={style.edit_button} onClick={() => setIsEditing(true)}>
                            Edit
                        </button>
                    </>
                )}
            </div>
            {showConfirmDelete && (
                <div className={style.confirm_modal}>
                    <p className={style.info_text}>Are you sure, you want to delete?</p>
                        <div className={style.deletion_confirmation_button_group}>
                            <button className={style.cancel_button} onClick={cancelDelete}>Cancel</button>
                            <button className={style.save_button} onClick={confirmDelete}>Confirm</button>
                        </div>
                </div>
            )}
        </div>
    );
}
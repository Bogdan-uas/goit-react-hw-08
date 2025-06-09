import style from "./ContactList.module.css";
import Contact from "../Contact/Contact.jsx";
import { useSelector } from "react-redux";
import { selectFilteredContacts } from "../../redux/contacts/selectors.js";
import { useState } from "react";

export default function ContactList() {
    const filteredContacts = useSelector(selectFilteredContacts);
    const [editingId, setEditingId] = useState(null);
    const [contactIdToDelete, setContactIdToDelete] = useState(null);

    return (
        <ul className={style.list}>
            {Array.isArray(filteredContacts) &&
                filteredContacts.map((contact) => (
                    <li className={style.item} key={contact.id}>
                        <Contact
                            contact={contact}
                            isEditing={editingId === contact.id}
                            isAnotherEditing={editingId !== null && editingId !== contact.id}
                            setEditingId={setEditingId}
                            editingId={editingId}
                            contactIdToDelete={contactIdToDelete}
                            setContactIdToDelete={setContactIdToDelete}
                        />
                    </li>
                ))}
        </ul>
    );
}

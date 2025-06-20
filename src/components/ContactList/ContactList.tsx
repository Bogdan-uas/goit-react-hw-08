import style from "./ContactList.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { selectFilteredContacts } from "../../redux/contacts/selectors";
import { useState, lazy, Suspense } from "react";

const Contact = lazy(() => import("../Contact/Contact"));

interface ContactType {
    id: string;
    name: string;
    number: string;
}

export default function ContactList() {
    const filteredContacts = useSelector<RootState, ContactType[]>(selectFilteredContacts);
    const [contactIdToDelete, setContactIdToDelete] = useState<string | null>(null);

    return (
        <ul className={style.list}>
            {filteredContacts.map((contact) => (
                <li className={style.item} key={contact.id}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Contact
                            contact={contact}
                            contactIdToDelete={contactIdToDelete}
                            setContactIdToDelete={setContactIdToDelete}
                        />
                    </Suspense>
                </li>
            ))}
        </ul>
    );
}
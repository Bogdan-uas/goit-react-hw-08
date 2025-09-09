import style from "./ContactList.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { selectFilteredContacts } from "../../redux/contacts/selectors";
import { useState, lazy, Suspense } from "react";
import Loader from "../Loader/Loader";

const Contact = lazy(() => import("../Contact/Contact"));

interface ContactType {
    id: string;
    name: string;
    number: string;
}

const ContactList: React.FC = () => {
    const filteredContacts = useSelector<RootState, ContactType[]>(selectFilteredContacts);
    const [contactIdToDelete, setContactIdToDelete] = useState<string | null>(null);

    return (
        <Suspense fallback={null}>
            <ul className={style.list}>
                {filteredContacts.map((contact) => (
                    <li className={style.item} key={contact.id}>
                        <Contact
                            contact={contact}
                            contactIdToDelete={contactIdToDelete}
                            setContactIdToDelete={setContactIdToDelete}
                        />
                    </li>
                ))}
            </ul>
        </Suspense>
    );
};

export default ContactList;
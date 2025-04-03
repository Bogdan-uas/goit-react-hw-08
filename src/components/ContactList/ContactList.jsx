import style from "./ContactList.module.css";
import Contact from "../Contact/Contact.jsx";
import { useSelector } from "react-redux";
import { selectFilteredContacts } from "../../redux/contactsSlice.js";

export default function ContactList() {
    const filteredContacts = useSelector(selectFilteredContacts);

    return (
        <ul className={style.list}>
            {filteredContacts.map((contact) => (
                <li className={style.item} key={contact.id}>
                    <Contact id={contact.id} />
                </li>
            ))}
        </ul>
    );
}


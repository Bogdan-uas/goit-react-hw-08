import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../../redux/contacts/operations.js";
import { selectIsLoading } from "../../redux/contacts/selectors.js";
import ContactList from "../ContactList/ContactList.jsx";
import SearchBox from "../SearchBox/SearchBox.jsx";
import ContactForm from "../ContactForm/ContactForm.jsx";

export default function ContactsPage() {
    const dispatch = useDispatch();
    const isLoading = useSelector(selectIsLoading);

    useEffect(() => {
        dispatch(fetchContacts());
    }, [dispatch]);

    return (
        <div className="main-container">
            {isLoading && <p>✋Loading...🤚</p>}
            <ContactForm />
            <SearchBox />
            <ContactList />
        </div>
    );
}

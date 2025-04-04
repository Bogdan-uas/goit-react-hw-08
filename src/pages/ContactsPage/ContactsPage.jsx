import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../../redux/contacts/operations.js";
import { selectIsLoading } from "../../redux/contacts/selectors.js";
import ContactList from "../../components/ContactList/ContactList.jsx";
import SearchBox from "../../components/SearchBox/SearchBox.jsx";
import ContactForm from "../../components/ContactForm/ContactForm.jsx";
import "../../components/App/App.css"

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

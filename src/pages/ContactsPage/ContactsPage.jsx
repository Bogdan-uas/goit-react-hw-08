import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../../redux/contacts/operations.js";
import { selectIsLoading, selectContacts } from "../../redux/contacts/selectors.js";
import ContactList from "../../components/ContactList/ContactList.jsx";
import SearchBox from "../../components/SearchBox/SearchBox.jsx";
import ContactForm from "../../components/ContactForm/ContactForm.jsx";
import PageTitleSetter from "../../components/PageTitleSetter/PageTitleSetter.jsx";
import "../../components/App/App.css"

export default function ContactsPage() {
    const dispatch = useDispatch();
    const isLoading = useSelector(selectIsLoading);
    const contacts = useSelector(selectContacts);
    const hasContacts = contacts.length > 0; 

    useEffect(() => {
        dispatch(fetchContacts());
    }, [dispatch]);

    return (
        <div className="main-container">
            <PageTitleSetter title="Contacts Page" />
            <ContactForm />
            {hasContacts && (
                <SearchBox />
            )}
            <ContactList />
            {isLoading && <p className="loading-text">✋Loading...🤚</p>}
        </div>
    );
}

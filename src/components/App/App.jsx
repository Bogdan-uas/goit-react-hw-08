import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../../redux/contactsOps.js";
import { selectIsLoading, selectError } from "../../redux/contactsSlice.js";
import ContactList from "../ContactList/ContactList.jsx";
import SearchBox from "../SearchBox/SearchBox.jsx";
import ContactForm from "../ContactForm/ContactForm.jsx";
import "./App.css";

function App() {
    const dispatch = useDispatch();
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectError);

    useEffect(() => {
        dispatch(fetchContacts());
    }, [dispatch]);

    return (
        <div className="main-container">
            <ContactForm />
            <SearchBox />
            {isLoading && <p>✋Loading...🤚</p>}
            {error && <p className="error">Error: {error}</p>}
            <ContactList />
        </div>
    );
}

export default App;
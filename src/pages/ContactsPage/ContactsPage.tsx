import { useEffect, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../../redux/contacts/operations";
import { selectIsLoading, selectContacts } from "../../redux/contacts/selectors";
import type { AppDispatch } from '../../redux/store';
import css from "./ContactsPage.module.css";
import "../../components/App/App.css";

const PageTitleSetter = lazy(() => import("../../components/PageTitleSetter/PageTitleSetter"));
const ContactForm = lazy(() => import("../../components/ContactForm/ContactForm"));
const SearchBox = lazy(() => import("../../components/SearchBox/SearchBox"));
const SortControl = lazy(() => import("../../components/SortControl/SortControl"));
const ContactList = lazy(() => import("../../components/ContactList/ContactList"));

export default function ContactsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const isLoading = useSelector(selectIsLoading);
    const contacts = useSelector(selectContacts);
    const hasContacts = contacts.length > 0;

    useEffect(() => {
        dispatch(fetchContacts());
    }, [dispatch]);

    return (
        <div className={css.main_container}>
            <Suspense fallback={<p className={css.loading_text}>🤚Loading page...🤚</p>}>
                <PageTitleSetter title="Contacts Page" />
                <ContactForm />
                {hasContacts && <SearchBox />}
                <SortControl />
                <ContactList />
            </Suspense>
            {isLoading && <p className={css.loading_text}>✋Loading...🤚</p>}
        </div>
    );
}
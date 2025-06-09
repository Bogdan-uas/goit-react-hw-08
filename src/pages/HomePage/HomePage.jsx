import css from './HomePage.module.css'
import PageTitleSetter from "../../components/PageTitleSetter/PageTitleSetter.jsx";

export default function HomePage() {
    return (
        <div>
            <PageTitleSetter title="Home Page" />

            <h1 className={css.main_title}>
                A simple phone book, where you can add new contacts, delete them, look for or edit a specific one.
            </h1>
    <p className={css.emoji}>🥸</p>
    </div>
);
}
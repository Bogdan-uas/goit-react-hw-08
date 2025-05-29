import css from './HomePage.module.css'


export default function HomePage() {
    return (
    <div>

            <h1 className={css.main_title}>
                Add your contacts, if you need, also new contacts. You can check then later, if you're calling the right number and also you can delete your contact that is no longer your contact.
            </h1>
    <p className={css.emoji}>🥸</p>
    </div>
);
}
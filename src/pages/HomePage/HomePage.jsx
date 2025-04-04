import css from './HomePage.module.css'

import { Helmet } from "react-helmet-async";

export default function HomePage() {
    return (
    <div>
    <Helmet>
        <title>Home Page</title>
    </Helmet>

    <h1 className={css.main-title}>Add new contacts that you need to remember and have fun with them later!</h1>
    <p className={css.emoji}>
        🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸
        🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸
        🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸
    </p>
    </div>
);
}
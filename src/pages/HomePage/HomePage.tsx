import { lazy, Suspense } from "react";
import css from "./HomePage.module.css";

const PageTitleSetter = lazy(() => import("../../components/PageTitleSetter/PageTitleSetter"));

export default function HomePage() {
return (
    <div>
    <Suspense fallback={null}>
        <PageTitleSetter title="Home Page" />
    </Suspense>

    <h1 className={css.main_title}>
        A simple phone book, where you can add new contacts, delete them, look for or edit a specific one.
    </h1>
    <p className={css.emoji}>🥸</p>
    </div>
);
}
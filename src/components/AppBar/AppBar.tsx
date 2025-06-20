import React from "react";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import Navigation from "../Navigation/Navigation";
import AuthNav from "../AuthNav/AuthNav";
import UserMenu from "../UserMenu/UserMenu";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import css from "./AppBar.module.css";

export default function AppBar(): React.ReactElement {
const isLoggedIn = useSelector(selectIsLoggedIn);

return (
    <header className={css.header}>
        <Navigation />
        <ThemeToggle />
        {isLoggedIn ? <UserMenu /> : <AuthNav />}
    </header>
);
}
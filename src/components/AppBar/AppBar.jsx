import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import Navigation from "../Navigation/Navigation";
import AuthNav from "../AuthNav/AuthNav";
import UserMenu from "../UserMenu/UserMenu";
import ThemeToggle from "../ThemeToggle/ThemeToggle.jsx";
import css from "./AppBar.module.css";

export default function AppBar() {
    const isLoggedIn = useSelector(selectIsLoggedIn);

return (
    <header className={css.header}>
        <Navigation />
        <ThemeToggle />
        {isLoggedIn ? <UserMenu /> : <AuthNav />}
    </header>
);
}
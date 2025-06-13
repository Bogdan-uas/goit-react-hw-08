import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../redux/ui/themeSlice";
import { selectDarkMode } from "../../redux/ui/selectors";
import css from "./ThemeToggle.module.css";

export default function ThemeToggle() {
    const dispatch = useDispatch();
    const darkMode = useSelector(selectDarkMode);

    return (
        <>
            <div className={css.main_container}>
            <p className={css.info_text}>You can also change your theme!</p>
            <button
                className={`${css.switch} ${darkMode ? css.active : ""}`}
                onClick={() => dispatch(toggleDarkMode())}
                aria-label="Toggle dark mode"
            >
                <span className={css.slider}></span>
                </button>
            </div>
        </>
    );
}
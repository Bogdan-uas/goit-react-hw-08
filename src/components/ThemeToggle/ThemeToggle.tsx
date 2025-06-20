import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../redux/ui/themeSlice";
import {
    selectDarkMode,
    selectIsModalOpen,
    selectIsEditingGlobal,
} from "../../redux/ui/selectors";
import { LuSun, LuMoon } from "react-icons/lu";
import { useEffect, ChangeEvent } from "react";
import toast from "react-hot-toast";
import css from "./ThemeToggle.module.css";

export default function ThemeToggle() {
const dispatch = useDispatch();
const darkMode = useSelector(selectDarkMode);
const isModalOpen = useSelector(selectIsModalOpen);
const isEditingGlobal = useSelector(selectIsEditingGlobal);
const isLocked = isModalOpen || isEditingGlobal;

useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
}, [darkMode]);

const handleToggle = () => {
    dispatch(toggleDarkMode());
};

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isLocked) {
    e.preventDefault();
    toast.error(
        isModalOpen
            ? "Close the current modal before changing the theme!"
            : "You can't change the theme while editing!",
        {
            duration: 4000,
            style: { borderRadius: "10px", textAlign: "center" },
        }
    );
    } else {
        handleToggle();
    }
};

return (
    <div className={css.main_container}>
    <p className={css.info_text}>You can also change your theme!</p>
    <div className={`${css.display} ${isLocked ? css.disabled : ""}`}>
        <input
            className={css.input}
            type="checkbox"
            id="toggle"
            checked={darkMode}
            onChange={handleChange}
        />
        <label className={css.label} htmlFor="toggle">
        <div className={css.circle}>
            <LuSun className={css.sun} />
            <svg
                className={css.moon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
            <path
                fillRule="evenodd"
                d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 
                0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0
                1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5
                0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
                clipRule="evenodd"
            />
            </svg>
        </div>
        </label>
    </div>
    </div>
);
}
import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectIsModalOpen, selectIsEditingGlobal } from "../../redux/ui/selectors";
import css from "./LanguageSelector.module.css";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const languageCodes = ["en", "de", "fr", "es", "uk", "pt", "ru", "it"];

export default function LanguageSelector() {
    const { t, i18n } = useTranslation();
    const isModalOpen = useSelector(selectIsModalOpen);
    const isEditingGlobal = useSelector(selectIsEditingGlobal);
    const isLocked = isModalOpen || isEditingGlobal;

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(i18n.language || "en");

    const dropdownRef = useRef<HTMLUListElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownCoords = useRef({ top: 0, left: 0, width: 0 });

    const handleLockedAction = useCallback(() => {
        if (isLocked) {
            toast.error(
                isModalOpen
                    ? t("contact.errorModalOpen")
                    : t("contact.errorEditingOther"),
                { duration: 4000, style: { borderRadius: "10px", textAlign: "center" } }
            );
        }
        return isLocked;
    }, [isLocked, isModalOpen, t]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const updateDropdownPosition = useCallback(() => {
        if (open && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            dropdownCoords.current = {
                top: rect.bottom,
                left: rect.left,
                width: rect.width,
            };
        }
    }, [open]);

    useEffect(() => {
        updateDropdownPosition();
        if (!open) return;
        window.addEventListener("scroll", updateDropdownPosition);
        window.addEventListener("resize", updateDropdownPosition);
        return () => {
            window.removeEventListener("scroll", updateDropdownPosition);
            window.removeEventListener("resize", updateDropdownPosition);
        };
    }, [open, updateDropdownPosition]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        if (open) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open]);

    const changeLanguage = async (code: string) => {
        setSelected(code);
        try {
            await i18n.changeLanguage(code);
            setOpen(false);
        } catch (err) {
            console.error("Failed to change language or refresh user:", err);
        }
    };

    const selectedLabel = t(`languages.${selected}`) || t("app.languageSelector.fallback");

    const dropdownElement = (
        <ul
            ref={dropdownRef}
            role="listbox"
            className={`${css.dropdownList} ${open ? css.open : ""}`}
            style={{ position: "fixed", ...dropdownCoords.current }}
        >
            {languageCodes.map((code) => (
                <li
                    key={code}
                    role="option"
                    aria-selected={selected === code}
                    tabIndex={0}
                    className={`${css.option} ${selected === code ? css.selected : ""}`}
                    onClick={() => !handleLockedAction() && changeLanguage(code)}
                    onKeyDown={(e) =>
                        (e.key === "Enter" || e.key === " ") &&
                        !handleLockedAction() &&
                        changeLanguage(code)
                    }
                >
                    {t(`languages.${code}`)}
                </li>
            ))}
        </ul>
    );

    return (
        <div className={css.container}>
            <p className={css.choice_text}>{t("app.languageSelector.prompt")}</p>

            <select
                value={selected}
                onChange={(e) => !handleLockedAction() && changeLanguage(e.target.value)}
                className={css.nativeSelect}
                tabIndex={-1}
            >
                {languageCodes.map((code) => (
                    <option key={code} value={code}>
                        {t(`languages.${code}`)}
                    </option>
                ))}
            </select>

            <button
                type="button"
                className={`${css.toggleButton} ${isLocked ? css.disabled : ""}`}
                onClick={() => !handleLockedAction() && setOpen((prev) => !prev)}
                ref={buttonRef}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                {selectedLabel}
                <span className={css.arrow} />
            </button>

            {open && dropdownElement}
        </div>
    );
}
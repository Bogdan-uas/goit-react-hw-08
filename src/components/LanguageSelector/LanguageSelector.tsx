import React, { useState, useRef, useEffect } from "react";
import { useDispatch ,useSelector } from "react-redux";
import { createPortal } from "react-dom";
import {
    selectIsModalOpen,
    selectIsEditingGlobal,
} from "../../redux/ui/selectors";
import css from "./LanguageSelector.module.css";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const languageCodes = ["en", "de", "fr", "es", "uk", "pt", "ru", "it"];

export default function LanguageSelector() {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(i18n.language || "en");
    const isModalOpen = useSelector(selectIsModalOpen);
    const isEditingGlobal = useSelector(selectIsEditingGlobal);
    const isLocked = isModalOpen || isEditingGlobal;

    const dropdownRef = useRef<HTMLUListElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [dropdownCoords, setDropdownCoords] = useState<{ top: number; left: number; width: number }>({
        top: 0,
        left: 0,
        width: 0,
    });

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        function updateDropdownPosition() {
            if (open && buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                setDropdownCoords({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                });
            }
        }
    
        updateDropdownPosition();
    
        if (open) {
            window.addEventListener("scroll", updateDropdownPosition);
            window.addEventListener("resize", updateDropdownPosition);
        }
    
        return () => {
            window.removeEventListener("scroll", updateDropdownPosition);
            window.removeEventListener("resize", updateDropdownPosition);
        };
    }, [open]);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setOpen(false);
            }
        }
    
        if (open) {
            document.addEventListener("keydown", handleKeyDown);
        }
    
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    const onNativeSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        setSelected(code);
        i18n.changeLanguage(code);
    };

    const toggleOpen = (e?: React.MouseEvent<HTMLButtonElement>) => {
        if (isLocked) {
            e?.preventDefault();
            toast.error(
                isModalOpen
                    ? t("app.languageSelector.toastModal")
                    : t("app.languageSelector.toastEditing"),
                {
                    duration: 4000,
                    style: { borderRadius: "10px", textAlign: "center" },
                }
            );
            return;
        }
        setOpen((prev) => !prev);
    };

    const onSelectLanguage = (code: string) => {
        setSelected(code);
        i18n.changeLanguage(code);
        setOpen(false);

        if (selectRef.current) {
            selectRef.current.value = code;
            const event = new Event("change", { bubbles: true });
            selectRef.current.dispatchEvent(event);
        }

        if (isLocked) {
            toast.error(
                isModalOpen
                    ? t("app.languageSelector.toastModal")
                    : t("app.languageSelector.toastEditing"),
                {
                    duration: 4000,
                    style: { borderRadius: "10px", textAlign: "center" },
                }
            );
            return;
        }
    };

    const selectedLabel = t(`languages.${selected}`) || t("app.languageSelector.fallback");

    const dropdownElement = (
        <ul
            ref={dropdownRef}
            role="listbox"
            tabIndex={-1}
            className={`${css.dropdownList} ${open ? css.open : ""}`}
            style={{
                position: 'absolute',
                top: dropdownCoords.top,
                left: dropdownCoords.left,
                width: dropdownCoords.width,
            }}
        >
            {languageCodes.map((code) => (
                <li
                    key={code}
                    role="option"
                    aria-selected={selected === code}
                    tabIndex={0}
                    className={`${css.option} ${selected === code ? css.selected : ""}`}
                    onClick={() => onSelectLanguage(code)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            onSelectLanguage(code);
                        }
                    }}
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
                ref={selectRef}
                value={selected}
                onChange={onNativeSelectChange}
                aria-label={t("app.languageSelector.selectLanguage")}
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
                onClick={toggleOpen}
                aria-haspopup="listbox"
                aria-expanded={open}
                ref={buttonRef}
                aria-disabled={isLocked}
            >
                {selectedLabel}
                <span className={css.arrow} />
            </button>

            {open && createPortal(dropdownElement, document.body)}
        </div>
    );
}
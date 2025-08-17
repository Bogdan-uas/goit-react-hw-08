import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createPortal } from "react-dom";
import { selectIsModalOpen, selectIsEditingGlobal } from "../../redux/ui/selectors";
import css from "./LanguageSelector.module.css";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { apiRefreshUser } from "../../redux/auth/operations";
import type { AppDispatch } from "../../redux/store";

const languageCodes = ["en", "de", "fr", "es", "uk", "pt", "ru", "it"];
const LOCAL_STORAGE_KEY = "languageSelectorHidden";

export default function LanguageSelector() {
    const { t, i18n } = useTranslation();
    const isModalOpen = useSelector(selectIsModalOpen);
    const isEditingGlobal = useSelector(selectIsEditingGlobal);
    const isLocked = isModalOpen || isEditingGlobal;
    const dispatch = useDispatch<AppDispatch>();

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(i18n.language || "en");
    const [hidden, setHidden] = useState(() => localStorage.getItem(LOCAL_STORAGE_KEY) === "true");
    const [showHidePrompt, setShowHidePrompt] = useState(false);

    const dropdownRef = useRef<HTMLUListElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const promptTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
        localStorage.setItem(LOCAL_STORAGE_KEY, hidden.toString());
    }, [hidden]);

    const startPromptTimer = useCallback((delay: number) => {
        if (promptTimerRef.current) clearTimeout(promptTimerRef.current);
        promptTimerRef.current = setTimeout(() => setShowHidePrompt(true), delay);
    }, []);

    useEffect(() => {
        startPromptTimer(5000);
        return () => {
            if (promptTimerRef.current) clearTimeout(promptTimerRef.current);
        };
    }, [startPromptTimer]);

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
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
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
            window.location.reload();
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
            style={{ position: "absolute", ...dropdownCoords.current }}
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

    if (hidden) {
        return (
            <button
                className={`${css.another_language_button} ${isLocked ? css.disabled : ""}`}
                type="button"
                onClick={() => !handleLockedAction() && setHidden(false)}
            >
                {t("app.languageSelector.anotherLanguage")}
            </button>
        );
    }

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

            {open && createPortal(dropdownElement, document.body)}

            {showHidePrompt && (
                <div className={css.promptOverlay}>
                    <div className={css.promptBox}>
                        <p className={css.promptText}>{t("app.languageSelector.hidePrompt")}</p>
                        <div className={css.promptButtons}>
                            <button
                                type="button"
                                className={`${css.promptButtonConfirm} ${isLocked ? css.disabled : ""}`}
                                onClick={() => !handleLockedAction() && (setHidden(true), setShowHidePrompt(false))}
                            >
                                ✔
                            </button>
                            <button
                                type="button"
                                className={`${css.promptButtonCancel} ${isLocked ? css.disabled : ""}`}
                                onClick={() => !handleLockedAction() && (setShowHidePrompt(false), startPromptTimer(20000))}
                            >
                                ✖
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
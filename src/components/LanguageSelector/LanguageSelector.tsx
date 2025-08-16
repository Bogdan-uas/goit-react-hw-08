import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { createPortal } from "react-dom";
import { selectIsModalOpen, selectIsEditingGlobal } from "../../redux/ui/selectors";
import css from "./LanguageSelector.module.css";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const languageCodes = ["en", "de", "fr", "es", "uk", "pt", "ru", "it"];

export default function LanguageSelector() {
    const { t, i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(i18n.language || "en");
    const isModalOpen = useSelector(selectIsModalOpen);
    const isEditingGlobal = useSelector(selectIsEditingGlobal);
    const isLocked = isModalOpen || isEditingGlobal;

    const dropdownRef = useRef<HTMLUListElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0, width: 0 });

    const [showHidePrompt, setShowHidePrompt] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [interacted, setInteracted] = useState(false);
    const promptTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startPromptTimer = (delay: number) => {
        if (promptTimerRef.current) clearTimeout(promptTimerRef.current);
        promptTimerRef.current = setTimeout(() => {
            if (!interacted) setShowHidePrompt(true);
        }, delay);
    };

    useEffect(() => {
        setInteracted(false);
        startPromptTimer(5000);
        return () => {
            if (promptTimerRef.current) clearTimeout(promptTimerRef.current);
        };
    }, []);

    const markInteraction = () => {
        if (!interacted) {
            setInteracted(true);
            if (promptTimerRef.current) clearTimeout(promptTimerRef.current);
        }
    };

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

    useEffect(() => {
        const updateDropdownPosition = () => {
            if (open && buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                setDropdownCoords({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                });
            }
        };

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
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        if (open) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open]);

    const onNativeSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        markInteraction();
        setSelected(e.target.value);
        i18n.changeLanguage(e.target.value);
        setOpen(false);
    };

    const toggleOpen = (e?: React.MouseEvent<HTMLButtonElement>) => {
        markInteraction();

        if (isLocked) {
            e?.preventDefault();
            toast.error(
                isModalOpen
                    ? t("app.languageSelector.toastModal")
                    : t("app.languageSelector.toastEditing"),
                { duration: 4000, style: { borderRadius: "10px", textAlign: "center" } }
            );
            return;
        }
        setOpen((prev) => !prev);
    };

    const onSelectLanguage = (code: string) => {
        markInteraction();
        setSelected(code);
        i18n.changeLanguage(code);
        setOpen(false);

        if (selectRef.current) {
            selectRef.current.value = code;
            selectRef.current.dispatchEvent(new Event("change", { bubbles: true }));
        }

        if (isLocked) {
            toast.error(
                isModalOpen
                    ? t("app.languageSelector.toastModal")
                    : t("app.languageSelector.toastEditing"),
                { duration: 4000, style: { borderRadius: "10px", textAlign: "center" } }
            );
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
                position: "absolute",
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
                        if (e.key === "Enter" || e.key === " ") onSelectLanguage(code);
                    }}
                >
                    {t(`languages.${code}`)}
                </li>
            ))}
        </ul>
    );

    if (hidden) {
        return (
            <button className={css.another_language_button} type="button" onClick={() => setHidden(false)}>
                {t("app.languageSelector.anotherLanguage")}
            </button>
        );
    }

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

            {showHidePrompt && (
                <div className={css.promptOverlay}>
                    <div className={css.promptBox}>
                        <p className={css.promptText}>{t("app.languageSelector.hidePrompt")}</p>
                        <div className={css.promptButtons}>
                            <button
                                type="button"
                                className={css.promptButtonConfirm}
                                onClick={() => {
                                    setHidden(true);
                                    setShowHidePrompt(false);
                                    markInteraction();
                                }}
                            >
                                ✔
                            </button>
                            <button
                                type="button"
                                className={css.promptButtonCancel}
                                onClick={() => {
                                    setShowHidePrompt(false);
                                    startPromptTimer(20000);
                                }}
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
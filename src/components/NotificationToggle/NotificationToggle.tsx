import { useSelector, useDispatch } from "react-redux";
import { toggleNotifications } from "../../redux/ui/notificationsSlice";
import {
    selectIsModalOpen,
    selectIsEditingGlobal,
    selectNotificationsEnabled,
} from "../../redux/ui/selectors";
import { ChangeEvent } from "react";
import AnimatedCheckIcon from "./AnimatedCheckIcon/AnimatedCheckIcon";
import AnimatedCrossIcon from "./AnimatedCrossIcon/AnimatedCrossIcon";
import { useTranslation } from "react-i18next";
import { useNotify } from "../../helpers/useNotify";
import toast from "react-hot-toast";
import css from "./NotificationToggle.module.css";

const TOGGLE_TOAST_ID = "notification-toggle-toast";

export default function NotificationToggle() {
    const dispatch = useDispatch();
    const notify = useNotify();
    const notificationsEnabled = useSelector(selectNotificationsEnabled);
    const isModalOpen = useSelector(selectIsModalOpen);
    const isEditingGlobal = useSelector(selectIsEditingGlobal);
    const isLocked = isModalOpen || isEditingGlobal;
    const { t } = useTranslation();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (isLocked) {
            e.preventDefault();
            notify.error(
                isEditingGlobal
                    ? t("notificationToggle.errors.cannotChangeWhileEditing")
                    : t("notificationToggle.errors.closeModalFirst"),
                { duration: 4000, style: { borderRadius: "10px", textAlign: "center" } }
            );
        } else {
            dispatch(toggleNotifications());

            if (notificationsEnabled) {
                notify.error(t("notificationToggle.toasts.disabledAll"), {
                    id: TOGGLE_TOAST_ID,
                    style: { borderRadius: "10px", textAlign: "center" },
                });
                setTimeout(() => {
                    toast.dismiss(TOGGLE_TOAST_ID);
                }, 2000);
            } else {
                toast.success(t("notificationToggle.toasts.enabledAll"), {
                    id: TOGGLE_TOAST_ID,
                    duration: 4000,
                    style: { borderRadius: "10px", textAlign: "center" },
                });
            }
        }
    };

    return (
        <div className={css.main_container}>
            <p className={css.info_text}>{t("notificationToggle.infoText")}</p>
            <div className={`${css.display} ${isLocked ? css.disabled : ""}`}>
                <input
                    className={css.input}
                    type="checkbox"
                    id="notification-toggle"
                    checked={!notificationsEnabled}
                    onChange={handleChange}
                    aria-checked={notificationsEnabled}
                    aria-label={t("notificationToggle.ariaLabel")}
                />
                <label
                    className={css.label}
                    htmlFor="notification-toggle"
                    tabIndex={0}
                    role="switch"
                    aria-checked={notificationsEnabled}
                >
                    <div className={css.circle}>
                        {notificationsEnabled ? (
                            <AnimatedCheckIcon
                                key="enabled"
                                className={css.enabledIcon}
                                aria-hidden="true"
                            />
                        ) : (
                            <AnimatedCrossIcon
                                key="disabled"
                                className={css.disabledIcon}
                                aria-hidden="true"
                            />
                        )}
                    </div>
                </label>
            </div>
        </div>
    );
}
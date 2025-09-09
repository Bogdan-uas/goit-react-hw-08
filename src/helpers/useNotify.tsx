import toast, { ToastOptions } from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectNotificationsEnabled } from "../redux/ui/selectors";

export const useNotify = () => {
    const enabled = useSelector(selectNotificationsEnabled);

    return {
        success: (msg: string, opts?: ToastOptions) =>
            enabled && toast.success(msg, opts),
        error: (msg: string, opts?: ToastOptions) =>
            enabled && toast.error(msg, opts),
        normal: (msg: string, opts?: ToastOptions) =>
            enabled && toast(msg, opts),
        dismiss: () => enabled && toast.dismiss(),
    };
};
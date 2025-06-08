import { useEffect, useRef } from "react";
import { FaEye } from "react-icons/fa";
import styles from "./AnimatedEyeIcon.module.css";

export default function AnimatedEyeIcon({ active }) {
const slashRef = useRef(null);

useEffect(() => {
    const slash = slashRef.current;
    if (active) {
        slash.classList.add(styles.animate_in);
        slash.classList.remove(styles.animate_out);
    } else {
        slash.classList.add(styles.animate_out);
        slash.classList.remove(styles.animate_in);
    }
}, [active]);

return (
    <div className={styles.wrapper}>
    <FaEye className={styles.eye} />
    <svg className={styles.svg} viewBox="0 0 18 18">
        <line
            ref={slashRef}
            className={styles.slash}
            x1="2"
            y1="16"
            x2="16"
            y2="2"
        />
    </svg>
    </div>
);
}
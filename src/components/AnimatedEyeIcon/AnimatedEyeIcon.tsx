import { useEffect, useRef } from "react";
import { BsEye } from "react-icons/bs";
import styles from "./AnimatedEyeIcon.module.css";

type AnimatedEyeIconProps = {
    active: boolean;
};

export default function AnimatedEyeIcon({ active }: AnimatedEyeIconProps) {
const slashRef = useRef<SVGLineElement | null>(null);

useEffect(() => {
    const slash = slashRef.current;
    if (!slash) return;

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
    <BsEye className={styles.eye} />
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
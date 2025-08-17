import { memo } from "react";
import { BsEye } from "react-icons/bs";
import clsx from "clsx";
import styles from "./AnimatedEyeIcon.module.css";

type AnimatedEyeIconProps = {
    readonly active: boolean;
};

function AnimatedEyeIconComponent({ active }: AnimatedEyeIconProps) {
    return (
        <div className={styles.wrapper}>
            <BsEye className={styles.eye} />
            <svg className={styles.svg} viewBox="0 0 18 18">
                <line
                    className={clsx(styles.slash, {
                        [styles.animate_in]: active,
                        [styles.animate_out]: !active,
                    })}
                    x1="2"
                    y1="16"
                    x2="16"
                    y2="2"
                />
            </svg>
        </div>
    );
}

export default memo(AnimatedEyeIconComponent);
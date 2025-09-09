import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

export default function AnimatedCheckIcon(props: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path
                d="M20 6L9 17l-5-5"
                style={{
                    strokeDasharray: 24,
                    strokeDashoffset: 24,
                    animation: "checkmark 0.5s ease forwards",
                }}
            />
            <style>
                {`
        @keyframes checkmark {
            to { stroke-dashoffset: 0; }
        }
        `}
            </style>
        </svg>
    );
}
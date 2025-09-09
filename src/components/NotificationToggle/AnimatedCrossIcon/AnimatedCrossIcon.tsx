import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

export default function AnimatedCrossIcon(props: IconProps) {
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
            <line
                x1="18"
                y1="6"
                x2="6"
                y2="18"
                style={{
                    strokeDasharray: 24,
                    strokeDashoffset: 24,
                    animation: "crossmark 0.5s ease forwards",
                }}
            />
            <line
                x1="6"
                y1="6"
                x2="18"
                y2="18"
                style={{
                    strokeDasharray: 24,
                    strokeDashoffset: 24,
                    animation: "crossmark 0.4s ease forwards",
                    animationDelay: "0.2s",
                }}
            />
            <style>
                {`
        @keyframes crossmark {
            to { stroke-dashoffset: 0; }
        }
        `}
            </style>
        </svg>
    );
}
"use client";

import { motion } from "framer-motion";
import React from "react";

type TooltipPosition = "top" | "bottom" | "left" | "right";

export function Tooltip({
                            label = "Last Updated:",
                            timeAgo,
                            position = "top",
                            className = "",
                        }: {
    label?: string;
    timeAgo: string;
    position?: TooltipPosition;
    className?: string;
}) {
    const getPositionClasses = () => {
        switch (position) {
            case "top":
                return "left-1/2 -translate-x-1/2 bottom-14";
            case "bottom":
                return "left-1/2 -translate-x-1/2 top-14";
            case "left":
                return "right-14 top-1/2 -translate-y-1/2";
            case "right":
                return "left-14 top-1/2 -translate-y-1/2";
        }
    };

    const getPointerPosition = () => {
        switch (position) {
            case "top":
                return "absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45";
            case "bottom":
                return "absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45";
            case "left":
                return "absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-900 rotate-45";
            case "right":
                return "absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-900 rotate-45";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${getPositionClasses()} w-60 p-2 bg-gray-900 text-white rounded-sm shadow-lg z-[9999] text-sm font-sans tracking-normal ${className}`}
        >
            <div className="text-sm">
                <span className="text-white">{label} </span>
                <span className="text-blue-400">{timeAgo}</span>
            </div>
            <div className={getPointerPosition()} />
        </motion.div>
    );
}
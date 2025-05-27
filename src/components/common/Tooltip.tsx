'use client'

import React from "react";
import { motion } from "framer-motion";

interface TooltipBubbleProps {
    children: React.ReactNode;
    className?: string;
    iconBoxSize: number;
}

export const TooltipBubble: React.FC<TooltipBubbleProps> = ({ children, className = "", iconBoxSize }) => (
    <motion.div
        initial={{
            opacity: 0,
            scale: 0.5,
            y: -20,
            transformOrigin: "bottom center"
        }}
        animate={{
            opacity: 1,
            scale: 1,
            y: 0
        }}
        exit={{
            opacity: 0,
            scale: 0.5,
            y: -10
        }}
        transition={{
            duration: 0.2,
            ease: [0.175, 0.885, 0.32, 1.275]
        }}
        style={iconBoxSize ? { bottom: (iconBoxSize + 12) } : undefined}
        className={`absolute left-1/2 -translate-x-1/2 w-60 p-2 bg-gray-900 text-white rounded-sm shadow-lg z-50 text-sm tracking-normal whitespace-pre-line ${className}`}
    >
        {children}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 transform rotate-45"></div>
    </motion.div>
);
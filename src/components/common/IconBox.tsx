import React, { useState } from "react";
import Image from "next/image";
import { TooltipBubble } from "./Tooltip";

interface IconBoxProps {
    src: string;
    alt: string;
    size: number;
    childrenSize: number;
    className?: string;
    style?: React.CSSProperties;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    children?: React.ReactNode;
    // Tooltip integration
    tooltip?: React.ReactNode;
    tooltipClassName?: string;
    showTooltip?: boolean;
}

export function IconBox({
    src,
    alt,
    size,
    childrenSize,
    className = "",
    style = {},
    onMouseEnter,
    onMouseLeave,
    children,
    tooltip,
    tooltipClassName = "",
    showTooltip = true,
}: IconBoxProps) {
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
        onMouseEnter?.();
    };

    const handleMouseLeave = () => {
        setHovered(false);
        onMouseLeave?.();
    };

    return (
        <div
            className={`relative rounded-sm flex items-center justify-center bg-[#181A20] ${className} cursor-pointer`}
            style={{ width: size, height: size, ...style }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Image
                src={src}
                alt={alt}
                width={size}
                height={size}
                className="rounded-sm object-contain"
                style={{
                    width: childrenSize,
                    height: childrenSize,
                    minWidth: childrenSize,
                    minHeight: childrenSize,
                    maxWidth: childrenSize,
                    maxHeight: childrenSize,
                }}
            />
            {children}
            {showTooltip && hovered && tooltip && (
                <TooltipBubble className={tooltipClassName} iconBoxSize={size}>
                    {tooltip}
                </TooltipBubble>
            )}
        </div>
    );
}
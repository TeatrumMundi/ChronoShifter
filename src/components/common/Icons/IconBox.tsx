import React, { useState } from "react";
import Image from "next/image";
import { TooltipBubble } from "../Tooltip";
import { BoxPlaceHolder } from "./IconPlaceholder";

interface IconBoxProps {
    src: string | undefined;
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
    showTooltip = true,
}: IconBoxProps) {
    const [hovered, setHovered] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
        onMouseEnter?.();
    };

    const handleMouseLeave = () => {
        setHovered(false);
        onMouseLeave?.();
    };

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div
            className={`relative rounded-sm flex items-center justify-center bg-[#181A20] cursor-pointer`}
            style={{ width: size, height: size, ...style }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {imageError || !src ? (
                <BoxPlaceHolder
                    size={childrenSize}
                    className={className}
                />
            ) : (
                <Image
                    src={src}
                    alt={alt}
                    width={size}
                    height={size}
                    className={`rounded-sm object-contain ${className}`}
                    style={{
                        width: childrenSize,
                        height: childrenSize,
                        minWidth: childrenSize,
                        minHeight: childrenSize,
                        maxWidth: childrenSize,
                        maxHeight: childrenSize,
                    }}
                    onError={handleImageError}
                />
            )}
            {children}
            {showTooltip && hovered && tooltip && (
                <TooltipBubble iconBoxSize={size}>
                    {tooltip}
                </TooltipBubble>
            )}
        </div>
    );
}
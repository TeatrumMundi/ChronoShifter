import React, { useState } from "react";
import Image from "next/image";
import { TooltipBubble } from "../Tooltip";
import { BoxPlaceHolder } from "./IconPlaceholder";

interface IconBoxProps {
    src?: string;
    alt: string;
    size: number;
    childrenSize: number;
    className?: string;
    style?: React.CSSProperties;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    children?: React.ReactNode;
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
    const [imageError, setImageError] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
        onMouseEnter?.();
    };

    const handleMouseLeave = () => {
        setHovered(false);
        onMouseLeave?.();
    };

    const shouldShowPlaceholder = imageError || !src;

    return (
        <div
            className="relative rounded-sm flex items-center justify-center bg-[#181A20] cursor-pointer"
            style={{ width: size, height: size, ...style }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {shouldShowPlaceholder ? (
                <BoxPlaceHolder size={childrenSize} className={className} />
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
                    onError={() => setImageError(true)}
                />
            )}
            {children}
            {showTooltip && hovered && tooltip && (
                <TooltipBubble iconBoxSize={size} className={tooltipClassName}>
                    {tooltip}
                </TooltipBubble>
            )}
        </div>
    );
}
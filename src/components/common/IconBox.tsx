import React from "react";
import Image from "next/image";

interface IconBoxProps {
    src: string;
    alt: string;
    size: number;
    childrenSize: number;
    className?: string;
    style?: React.CSSProperties;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    children?: React.ReactNode; // np. tooltip
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
}: IconBoxProps) {
    return (
        <div
            className={`relative rounded-sm flex items-center justify-center bg-[#181A20] ${className}`}
            style={{ width: size, height: size, ...style }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
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
        </div>
    );
}
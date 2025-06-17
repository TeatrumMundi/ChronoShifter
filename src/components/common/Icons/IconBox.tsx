import Image from "next/image";
import { Tooltip } from "../Tooltip";
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
    tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
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
    tooltipPlacement = 'top',
}: IconBoxProps) {
    const shouldShowPlaceholder = !src;

    const iconContent = (
        <div
            className="relative rounded-sm flex items-center justify-center bg-[#181A20] cursor-pointer select-none"
            style={{ width: size, height: size, ...style }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
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
                    unoptimized
                />
            )}
            {children}
        </div>
    );

    if (showTooltip && tooltip) {
        return (
            <Tooltip 
                content={tooltip} 
                className={tooltipClassName}
                placement={tooltipPlacement}
            >
                {iconContent}
            </Tooltip>
        );
    }

    return iconContent;
}
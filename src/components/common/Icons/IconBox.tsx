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
                <BoxPlaceHolder size={childrenSize} className={className}>
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                        ?
                    </div>
                </BoxPlaceHolder>
            ) : (
                <>
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
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector('.error-placeholder')) {
                                const errorPlaceholder = document.createElement('div');
                                errorPlaceholder.className = 'error-placeholder absolute inset-0';
                                errorPlaceholder.innerHTML = `
                                    <div class="object-contain bg-white/5 backdrop-blur-md border border-white/10 rounded-sm shadow-lg relative overflow-hidden w-full h-full flex items-center justify-center">
                                        <div class="text-white font-bold" style="font-size: ${childrenSize * 0.4}px;">?</div>
                                        <div class="absolute inset-0 rounded-xl opacity-60" style="background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 70%);"></div>
                                        <div class="absolute inset-0 rounded-xl" style="background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%); animation: shimmer 3s ease-in-out infinite;"></div>
                                    </div>
                                `;
                                parent.appendChild(errorPlaceholder);
                            }
                        }}
                        unoptimized
                    />
                </>
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
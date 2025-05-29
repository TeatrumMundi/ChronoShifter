interface IconPlaceholderProps {
    size: number;
    className?: string;
}

export function BoxPlaceHolder({ size, className = "" }: IconPlaceholderProps) {
    return (
        <div
            className={`object-contain bg-gray-800/90 rounded-sm ${className}`}
            style={{
                width: size,
                height: size,
                minWidth: size,
                minHeight: size,
                maxWidth: size,
                maxHeight: size,
            }}
        />
    );
}
interface BoxPlaceHolderProps 
{
    size: number;
    className?: string;
}

export const BoxPlaceHolder = ({ size = 32, className = "" } : BoxPlaceHolderProps) => {
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
};
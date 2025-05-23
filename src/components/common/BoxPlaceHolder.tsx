interface BoxPlaceHolderProps 
{
    size: number;
    className?: string;
}

export const BoxPlaceHolder = ({ size = 32, className = "" } : BoxPlaceHolderProps) => {
    return (
        <div className={`w-[${size}px] h-[${size}px] min-w-[${size}px] min-h-[${size}px] max-w-[${size}px] max-h-[${size}px] object-contain bg-gray-800/90 rounded-sm ${className}`} />
)}
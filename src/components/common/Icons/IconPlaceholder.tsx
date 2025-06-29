interface IconPlaceholderProps {
    size: number;
    className?: string;
    children?: React.ReactNode;
}

export function BoxPlaceHolder({ size, className = "", children }: IconPlaceholderProps) {
    return (
        <div
            className={`object-contain bg-white/5 backdrop-blur-md border border-white/10 rounded-sm shadow-lg relative overflow-hidden ${className}`}
            style={{
                width: size,
                height: size,
                minWidth: size,
                minHeight: size,
                maxWidth: size,
                maxHeight: size,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%)',
                backdropFilter: 'blur(20px)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
        >
            {/* Inner glow effect */}
            <div 
                className="absolute inset-0 rounded-xl opacity-60"
                style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
                }}
            />
            {/* Subtle animated shimmer */}
            <div 
                className="absolute inset-0 rounded-xl"
                style={{
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)',
                    animation: 'shimmer 3s ease-in-out infinite',
                }}
            />
            {children}
        </div>
    );
}
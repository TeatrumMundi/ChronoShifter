import Image from "next/image";

interface BackgroundProps {
    splashUrl: string;
    quality: number;
    className?: string;
}

export function Background({splashUrl, quality, className = "",}: BackgroundProps) {
    if (!splashUrl) return null;

    return (
        <div className={`fixed inset-0 -z-10 min-h-screen bg-[#0c0c1b] ${className}`}>
            <Image
                src={splashUrl}
                alt="Background"
                fill
                quality={quality}
                className="object-cover transition-opacity duration-500 opacity-100"
                priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/50 to-indigo-600/50" />
        </div>
    );
}
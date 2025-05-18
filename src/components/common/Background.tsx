import Image from "next/image";

interface BackgroundProps {
    quality: number;
    className?: string;
}

const backgroundMap: Record<number, string> = {
    1: "/main/1.jpg", // Monday
    2: "/main/2.jpg", // Tuesday
    3: "/main/3.jpg", // Wednesday
    4: "/main/4.jpg", // Thursday
    5: "/main/5.jpg", // Friday
    6: "/main/6.jpg", // Saturday
    0: "/main/7.jpg", // Sunday
};

export function Background({ quality, className = "" }: BackgroundProps) {
    const today = new Date().getDay();
    const splashUrl = backgroundMap[today] || "/main/1.jpg";

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
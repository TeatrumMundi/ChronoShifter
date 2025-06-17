import { getSummonerIconUrl } from '@/utils/getLeagueAssets/getLOLAssets';
import Image from 'next/image';

interface SummonerIconProps {
    prfileIconID: number;
    level: string;
    quality: number;
    loading: "eager" | "lazy";
    priority: boolean;
    size: number
}

export default function SummonerIcon({ 
    prfileIconID, 
    level, 
    quality, 
    loading, 
    priority, 
    size 
}: SummonerIconProps) {
    return (
        <div className="relative flex-shrink-0">
            <div className="relative" style={{ height: `${size}px`, width: `${size}px` }}>
                <Image
                    src={getSummonerIconUrl(prfileIconID)}
                    alt="Summoner Icon"
                    fill
                    className="rounded-sm object-cover"
                    sizes={`${size}px`}
                    quality={quality}
                    loading={loading}
                    priority={priority}
                />
            </div>
            <div className="absolute bottom-0 w-full bg-black/70 rounded-b-sm px-2 py-0.25 text-xs text-white text-center tracking-widest">
                {level}
            </div>
        </div>
    );
}
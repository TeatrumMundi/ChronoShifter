import { getSummonerIconUrl } from '@/utils/getLeagueAssets/getLOLAssets';
import Image from 'next/image';

interface SummonerIconProps {
    prfileIconID: number;
    level: string;
}


export default function SummonerIcon({ prfileIconID, level }: SummonerIconProps) {
    return (
        <div className="relative flex-shrink-0">
            <div className="relative h-24 w-24">
                <Image
                    src={getSummonerIconUrl(prfileIconID)}
                    alt="Summoner Icon"
                    fill
                    className="rounded-sm object-cover"
                    sizes="96px"
                    quality={50}
                    loading="eager"
                    priority
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/summonerIcons/default.jpg';
                    }}
                />
            </div>
            <div className="absolute bottom-0 w-full bg-black/70 rounded-b-sm px-2 py-0.25 text-xs text-white text-center tracking-widest">
                {level}
            </div>
        </div>
    );
}
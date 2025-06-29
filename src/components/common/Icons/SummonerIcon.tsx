import { getSummonerIconUrl } from '@/utils/getLeagueAssets/getLOLAssets';
import { IconBox } from './IconBox';

interface SummonerIconProps {
    prfileIconID: number;
    level: string;
    size: number;
    quality?: number;
    loading?: "eager" | "lazy";
    priority?: boolean;
}

export default function SummonerIcon({ 
    prfileIconID, 
    level, 
    size 
}: SummonerIconProps) {
    return (
        <div className="relative flex-shrink-0 pointer-events-none">
            <IconBox
                src={getSummonerIconUrl(prfileIconID)}
                alt="Summoner Icon"
                size={size}
                childrenSize={size}
                className="object-cover"
                showTooltip={false}
                style={{ cursor: 'default' }}
            >
                <div className="absolute bottom-0 w-full bg-black/70 rounded-b-sm px-2 py-0.25 text-xs text-white text-center tracking-widest">
                    {level}
                </div>
            </IconBox>
        </div>
    );
}
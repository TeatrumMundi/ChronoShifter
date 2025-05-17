import { userInfo } from '../../interfaces/interfaces';
import { fetchFromRiotAPI } from './fetchFromRiotAPI';

export async function getAccountByRiotID(tagLine: string, gameName: string, region: string): Promise<userInfo> {
    const response : Response = await fetchFromRiotAPI(`https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`);
    return await response.json() as Promise<userInfo>;
}

console.log(process.env.RIOT_API_KEY);
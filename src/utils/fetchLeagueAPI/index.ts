// Central export file for all Riot API endpoint functions

export { default as getAccountByRiotID } from './getAccountByRiotID';
export { default as getActiveRegionByPuuid } from './getActiveRegionByPuuid';
export { default as getMatchDetailsByMatchID } from './getMatchDetailsByMatchID';
export { default as getMatchTimelineByMatchID } from './getMatchTimelineByMatchID';
export { default as getRankedLeagueEntries } from './getRankedLeagueEntries';
export { default as getRecentMatchesIDsByPuuid } from './getRecentMatchesIDsByPuuid';
export { default as getSummonerByPuuid } from './getSummonerByPuuid';
export { fetchFromRiotAPI } from './fetchFromRiotAPI';
"use client";

import { RiotAccount } from "@/interfaces/interfaces";

export default function AccountProfile({ riotAccount }: { riotAccount: RiotAccount }) {
  const { leagueAccount } = riotAccount;
  return (
    <div>
      <p>PUUID: {riotAccount.riotAccountDetails.puuid}</p>
      <p>TagLine: {riotAccount.riotAccountDetails.tagLine}</p>
      <p>GameName: {riotAccount.riotAccountDetails.gameName}</p>
      <p>Summoner Level: {leagueAccount.leagueAccountsDetails.summonerLevel}</p>
      <p>Profile Icon ID: {leagueAccount.leagueAccountsDetails.profileIconId}</p>
      {leagueAccount.leagueRank[1] && (
        <>
          <p>Rank: {leagueAccount.leagueRank[1].rank}</p>
          <p>League Points: {leagueAccount.leagueRank[1].leaguePoints}</p>
          <p>Queue Type: {leagueAccount.leagueRank[1].queueType}</p>
          <p>Tier: {leagueAccount.leagueRank[1].tier}</p>
          <p>Wins: {leagueAccount.leagueRank[1].wins}</p>
          <p>Losses: {leagueAccount.leagueRank[1].losses}</p>
          <p>Win Rate: {leagueAccount.leagueRank[1].winRate}</p>
          <p>Hot Streak: {leagueAccount.leagueRank[1].hotStreak ? "Hot Streak" : "Not Hot Streak"}</p>
        </>
      )}
      {leagueAccount.leagueRank[0] && (
        <>
          <p>Rank: {leagueAccount.leagueRank[0].rank}</p>
          <p>League Points: {leagueAccount.leagueRank[0].leaguePoints}</p>
          <p>Queue Type: {leagueAccount.leagueRank[0].queueType}</p>
          <p>Tier: {leagueAccount.leagueRank[0].tier}</p>
          <p>Wins: {leagueAccount.leagueRank[0].wins}</p>
          <p>Losses: {leagueAccount.leagueRank[0].losses}</p>
          <p>Win Rate: {leagueAccount.leagueRank[0].winRate}</p>
          <p>Hot Streak: {leagueAccount.leagueRank[0].hotStreak ? "Hot Streak" : "Not Hot Streak"}</p>
        </>
      )}
      <p>Match ID: {leagueAccount.recentMatches[0].matchId}</p>
      <p>Game Duration: {leagueAccount.recentMatches[0].matchDetails.gameDuration}</p>
      <p>Game Creation: {leagueAccount.recentMatches[0].matchDetails.gameCreation}</p>
      <p>Game End Timestamp: {leagueAccount.recentMatches[0].matchDetails.gameEndTimestamp}</p>
      <p>Game Mode: {leagueAccount.recentMatches[0].matchDetails.gameMode}</p>
      <p>Game Type: {leagueAccount.recentMatches[0].matchDetails.gameType}</p>
      {leagueAccount.recentMatches[0].matchDetails.participants.map((participant) => (
        <div key={participant.puuid}>
          <p>participantPuuid: {participant.puuid}</p>
          <p>Summoner ID: {participant.riotIdGameName}#{participant.riotIdTagline}</p>
          <p>Summoner Name: {participant.summonerName}</p>
          <p>Champ level: {participant.champLevel}</p>
          <p>Champ id: {participant.championId}</p>
          <p>Team ID: {participant.teamId}</p>
          <p>Champion Name: {participant.championName}</p>
          <p>K/D/A: {participant.kills}/{participant.deaths}/{participant.assists}</p>
          <p>Total minions killed: {participant.totalMinionsKilled}</p>
          <p>Neutral Minions Killed: {participant.neutralMinionsKilled}</p>
          <p>All Minions Killed: {participant.allMinionsKilled}</p>
          <p>Gold Earned: {participant.goldEarned}</p>
          <p>Total Heals On Teammates: {participant.totalHealsOnTeammates}</p>
          <p>Total Damage Shielded On Teammates: {participant.totalDamageShieldedOnTeammates}</p>
          <p>Total Damage Taken: {participant.totalDamageTaken}</p>
          <p>Total Damage Dealt To Champions: {participant.totalDamageDealtToChampions}</p>
          <p>Individual Position: {participant.individualPosition}</p>
          <br />
        </div>
      ))}
    </div>
  );
}
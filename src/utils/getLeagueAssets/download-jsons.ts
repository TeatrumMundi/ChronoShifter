#!/usr/bin/env node
/**
 * JSON Downloader Script
 * Downloads JSON files from specified URLs with dynamic game version
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

interface ApiUrls {
  [key: string]: string;
}

/**
 * Get the current game version from .env file or return default.
 * 
 * @returns Game version string
 */
async function getGameVersion(): Promise<string> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const envPath = path.join(__dirname, '../../../.env');
  
  try {
    const content = await fs.readFile(envPath, 'utf-8');
    
    for (const line of content.split('\n')) {
      if (line.startsWith('NEXT_PUBLIC_GAME_VERSION=')) {
        const version = line.split('=', 2)[1]?.trim();
        if (version) {
          console.log(`Using game version from .env: ${version}`);
          return version;
        }
      }
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('Warning: .env file not found');
    } else {
      console.log(`Warning: Failed to read .env file: ${error}`);
    }
  }
  
  // Fallback to default version
  const defaultVersion = '15.10.1';
  console.log(`Using default game version: ${defaultVersion}`);
  return defaultVersion;
}

/**
 * Get API URLs with updated game version.
 * 
 * @returns Dictionary of API URLs
 */
async function getApiUrls(): Promise<ApiUrls> {
  const gameVersion = await getGameVersion();
  
  return {
    runes: `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/data/en_US/runesReforged.json`,
    items: 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json',
    augments: 'https://raw.communitydragon.org/latest/cdragon/arena/en_us.json',
    champions: `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/data/en_US/championFull.json`,
    summonerSpells: 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-spells.json',
    versions: 'https://ddragon.leagueoflegends.com/api/versions.json',
    queues: 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/queues.json',
  };
}

/**
 * Fetch JSON data from URL.
 * 
 * @param url - URL to fetch JSON from
 * @returns Parsed JSON data
 * @throws Error if request fails or response is not valid JSON
 */
async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

/**
 * Save JSON data to file.
 * 
 * @param filePath - Path where to save the file
 * @param data - JSON data to save
 */
async function saveJson(filePath: string, data: unknown): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Update NEXT_PUBLIC_GAME_VERSION in .env file with the latest version.
 * 
 * @param scriptDir - Directory where the script is located
 */
async function updateGameVersion(scriptDir: string): Promise<void> {
  const versionsPath = path.join(scriptDir, 'versions.json');
  const envPath = path.join(scriptDir, '../../../.env');
  
  try {
    // Read versions.json
    const content = await fs.readFile(versionsPath, 'utf-8');
    const versions = JSON.parse(content);
    
    if (!Array.isArray(versions) || versions.length === 0) {
      console.log('Warning: versions.json is empty or not an array');
      return;
    }
    
    const latestVersion = versions[0]; // First version is the latest
    console.log(`Latest version found: ${latestVersion}`);
    
    // Check if .env file exists
    let envContent = '';
    try {
      envContent = await fs.readFile(envPath, 'utf-8');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log('Creating new .env file...');
      } else {
        throw error;
      }
    }
    
    // Update or add NEXT_PUBLIC_GAME_VERSION
    const lines = envContent ? envContent.split('\n') : [];
    let versionUpdated = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('NEXT_PUBLIC_GAME_VERSION=')) {
        const oldVersion = line.includes('=') ? line.split('=', 2)[1] || '' : '';
        if (oldVersion !== latestVersion) {
          lines[i] = `NEXT_PUBLIC_GAME_VERSION=${latestVersion}`;
          console.log(`✔ Updated NEXT_PUBLIC_GAME_VERSION from ${oldVersion} to ${latestVersion}`);
        } else {
          console.log(`✔ NEXT_PUBLIC_GAME_VERSION is already up to date (${latestVersion})`);
        }
        versionUpdated = true;
        break;
      }
    }
    
    // If NEXT_PUBLIC_GAME_VERSION was not found, add it
    if (!versionUpdated) {
      lines.push(`NEXT_PUBLIC_GAME_VERSION=${latestVersion}`);
      console.log(`✔ Added NEXT_PUBLIC_GAME_VERSION=${latestVersion} to .env`);
    }
    
    // Write back to .env file
    await fs.writeFile(envPath, lines.join('\n'), 'utf-8');
    
  } catch (error) {
    console.log(`✖ Failed to update game version: ${error}`);
  }
}

/**
 * Download and save a single JSON file.
 * 
 * @param key - Key name for the file
 * @param url - URL to download from
 * @param scriptDir - Directory where to save the file
 */
async function downloadFile(key: string, url: string, scriptDir: string): Promise<void> {
  console.log(`Downloading "${key}" from ${url}...`);
  
  try {
    const jsonData = await fetchJson(url);
    const outputPath = path.join(scriptDir, `${key}.json`);
    await saveJson(outputPath, jsonData);
    console.log(`✔ Saved as ${key}.json`);
    
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.log(`✖ Failed to download ${key}: Network error - ${error.message}`);
    } else if (error instanceof SyntaxError) {
      console.log(`✖ Failed to download ${key}: Invalid JSON - ${error.message}`);
    } else {
      console.log(`✖ Failed to download ${key}: ${error}`);
    }
  }
}

/**
 * Main function to orchestrate the download process.
 */
async function main(): Promise<void> {
  const __filename = fileURLToPath(import.meta.url);
  const scriptDir = path.dirname(__filename);
  
  try {
    // First, update the game version
    await updateGameVersion(scriptDir);
    
    // Small delay to separate output
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Get API URLs with updated game version
    const apiUrls = await getApiUrls();
    
    if (Object.keys(apiUrls).length === 0) {
      console.log('Warning: API_URLS is empty');
      return;
    }
    
    // Create promises for all downloads
    const downloadPromises = Object.entries(apiUrls).map(([key, url]) =>
      downloadFile(key, url, scriptDir)
    );
    
    // Execute all downloads concurrently
    await Promise.allSettled(downloadPromises);
    
    console.log(`\nCompleted processing ${downloadPromises.length} entries.`);
    
  } catch (error) {
    console.log(`Unexpected error: ${error}`);
    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

export {
  getGameVersion,
  getApiUrls,
  fetchJson,
  saveJson,
  updateGameVersion,
  downloadFile,
  main
};

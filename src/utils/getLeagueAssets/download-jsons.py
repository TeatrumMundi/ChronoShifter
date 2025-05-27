#!/usr/bin/env python3
"""
JSON Downloader Script
Downloads JSON files from URLs specified in update.json
"""

import json
import asyncio
import aiohttp
import aiofiles
from pathlib import Path
from typing import Dict, Any
import sys


async def fetch_json(session: aiohttp.ClientSession, url: str) -> Dict[str, Any]:
    """
    Fetch JSON data from URL asynchronously.
    
    Args:
        session: aiohttp session for making requests
        url: URL to fetch JSON from
        
    Returns:
        Parsed JSON data as dictionary
        
    Raises:
        aiohttp.ClientError: If request fails
        json.JSONDecodeError: If response is not valid JSON
    """
    async with session.get(url) as response:
        response.raise_for_status()
        text = await response.text()
        return json.loads(text)


async def save_json(file_path: Path, data: Dict[str, Any]) -> None:
    """
    Save JSON data to file asynchronously.
    
    Args:
        file_path: Path where to save the file
        data: JSON data to save
    """
    async with aiofiles.open(file_path, 'w', encoding='utf-8') as f:
        await f.write(json.dumps(data, indent=2, ensure_ascii=False))


async def download_file(session: aiohttp.ClientSession, key: str, url: str, script_dir: Path) -> None:
    """
    Download and save a single JSON file.
    
    Args:
        session: aiohttp session for making requests
        key: Key name for the file
        url: URL to download from
        script_dir: Directory where to save the file
    """
    print(f'Downloading "{key}" from {url}...')
    
    try:
        json_data = await fetch_json(session, url)
        output_path = script_dir / f"{key}.json"
        await save_json(output_path, json_data)
        print(f"✔ Saved as {key}.json")
        
    except aiohttp.ClientError as e:
        print(f"✖ Failed to download {key}: Network error - {e}")
    except json.JSONDecodeError as e:
        print(f"✖ Failed to download {key}: Invalid JSON - {e}")
    except Exception as e:
        print(f"✖ Failed to download {key}: {e}")


async def main() -> None:
    """Main function to orchestrate the download process."""
    script_dir = Path(__file__).parent
    update_path = script_dir / "update.json"
    
    # Check if update.json exists
    if not update_path.exists():
        print(f"Error: {update_path} not found!")
        sys.exit(1)
    
    try:
        # Read and parse update.json
        async with aiofiles.open(update_path, 'r', encoding='utf-8') as f:
            content = await f.read()
            update_data = json.loads(content)
        
        if not isinstance(update_data, dict):
            print("Error: update.json should contain a JSON object")
            sys.exit(1)
        
        if not update_data:
            print("Warning: update.json is empty")
            return
        
        # Create aiohttp session with timeout and connection limits
        timeout = aiohttp.ClientTimeout(total=30)
        connector = aiohttp.TCPConnector(limit=10)  # Limit concurrent connections
        
        async with aiohttp.ClientSession(timeout=timeout, connector=connector) as session:
            # Create tasks for all downloads
            tasks = [
                download_file(session, key, url, script_dir)
                for key, url in update_data.items()
                if isinstance(url, str)  # Ensure URL is a string
            ]
            
            if not tasks:
                print("Warning: No valid URL entries found in update.json")
                return
            
            # Execute all downloads concurrently
            await asyncio.gather(*tasks, return_exceptions=True)
            
        print(f"\nCompleted processing {len(tasks)} entries.")
        
    except json.JSONDecodeError as e:
        print(f"Failed to parse update.json: {e}")
        sys.exit(1)
    except FileNotFoundError:
        print(f"Error: {update_path} not found!")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    # Check if required packages are available
    try:
        import aiohttp
        import aiofiles
    except ImportError as e:
        print(f"Required package not installed: {e}")
        print("Install with: pip install aiohttp aiofiles")
        sys.exit(1)
    
    asyncio.run(main())
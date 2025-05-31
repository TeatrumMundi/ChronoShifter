/**
 * Fetches data from the Riot Games API with the provided endpoint.
 *
 * @param {string} endpoint - The endpoint URL to fetch data from the Riot Games API.
 * @returns {Promise<Response>} A promise that resolves to the response from the Riot API.
 *
 * @throws {Error} Throws an error if the Riot API key is missing or there is an issue with the request.
 */
export async function fetchFromRiotAPI(endpoint: string): Promise<Response> {
    // Input validation
    if (!endpoint || typeof endpoint !== 'string' || endpoint.trim().length === 0) {
        throw new Error('Endpoint is required and must be a non-empty string');
    }

    // Retrieve the Riot API key from environment variables
    const riotApiKey = process.env.RIOT_API_KEY;

    // Check if the Riot API key is missing
    if (!riotApiKey) {
        throw new Error("Riot API key is missing");
    }

    try {
        // Make the request to the Riot API with the API key and content type header
        const response = await fetch(endpoint, {
            headers: {
                "X-Riot-Token": riotApiKey,
                "Content-Type": "application/json",
            },
        });

        // Return the response directly - let calling functions handle status checks and JSON parsing
        return response;

    } catch (error) {
        // Re-throw with more context, preserving the original error
        if (error instanceof Error) {
            throw new Error(`Network error while fetching from Riot API endpoint "${endpoint}": ${error.message}`);
        }
        throw new Error(`Unexpected error while fetching from Riot API endpoint "${endpoint}": ${String(error)}`);
    }
}
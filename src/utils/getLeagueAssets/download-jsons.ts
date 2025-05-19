import { promises as fs } from "fs";
import path from "path";
import https from "https";

// Helper: fetch JSON from URL
function fetchJson<T = unknown>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = "";

            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (err) {
                    reject(`Error parsing JSON from ${url}: ${err}`);
                }
            });
        }).on("error", (err) => {
            reject(`Error fetching ${url}: ${err.message}`);
        });
    });
}

async function main() {
    const scriptDir = __dirname;
    const updatePath = path.join(scriptDir, "update.json");

    try {
        const updateRaw = await fs.readFile(updatePath, "utf-8");
        const updateData = JSON.parse(updateRaw);

        const entries = Object.entries(updateData) as [string, string][];

        for (const [key, url] of entries) {
            console.log(`Downloading "${key}" from ${url}...`);
            try {
                const json = await fetchJson(url);
                const outputPath = path.join(scriptDir, `${key}.json`);
                await fs.writeFile(outputPath, JSON.stringify(json, null, 2), "utf-8");
                console.log(`✔ Saved as ${key}.json`);
            } catch (err) {
                console.error(`✖ Failed to download ${key}:`, err);
            }
        }
    } catch (err) {
        console.error("Failed to read or parse update.json:", err);
    }
}

void main();
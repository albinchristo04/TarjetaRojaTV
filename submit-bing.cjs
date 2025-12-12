const fs = require('fs');
const https = require('https');

// Configuration
const API_KEY = '08dfb913330747d6a6df4a8c49a8ff0b';
const SITE_URL = 'https://tarjetarojaenvivo.live'; // Base site URL as verified in Bing Webmaster Tools
const SITEMAP_FILE = 'sitemap-urls.json';
const BATCH_SIZE = 500; // Max URLs per batch allowed by Bing

function submitToBing(urls) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            siteUrl: SITE_URL,
            urlList: urls
        });

        const options = {
            hostname: 'ssl.bing.com',
            path: `/webmaster/api.svc/json/SubmitUrlbatch?apikey=${API_KEY}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`Status Code: ${res.statusCode}, Message: ${data}`));
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(payload);
        req.end();
    });
}

async function main() {
    try {
        if (!fs.existsSync(SITEMAP_FILE)) {
            console.error(`❌ Sitemap file not found: ${SITEMAP_FILE}`);
            console.log('Run "npm run generate" first to generate the sitemap.');
            process.exit(1);
        }

        const sitemapData = JSON.parse(fs.readFileSync(SITEMAP_FILE, 'utf8'));
        const allUrls = sitemapData.map(entry => entry.loc);

        if (allUrls.length === 0) {
            console.log('⚠️ No URLs found to submit.');
            return;
        }

        console.log(`Found ${allUrls.length} URLs to submit.`);

        // Split into batches
        for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
            const batch = allUrls.slice(i, i + BATCH_SIZE);
            console.log(`Submitting batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} URLs)...`);

            try {
                const result = await submitToBing(batch);
                console.log('✅ Batch submitted successfully:', result);
            } catch (error) {
                console.error('❌ Error submitting batch:', error.message);
                console.error('👉 Tip: Check your API Key and ensure https://tarjetarojaenvivo.live is verified in Bing Webmaster Tools.');
            }
        }

        console.log('🎉 Bing URL submission process completed.');

    } catch (error) {
        console.error('❌ Fatal Error:', error.message);
        process.exit(1);
    }
}

main();

const https = require('https');
const fs = require('fs');

const DOMAIN = 'https://tarjetarojaenvivo.live';
const KEY = process.env.INDEXNOW_KEY;

if (!KEY) {
  console.error('❌ INDEXNOW_KEY missing');
  process.exit(1);
}

const urls = JSON.parse(fs.readFileSync('sitemap-urls.json', 'utf8'))
  .map(u => u.loc)
  .slice(0, 10000);

const payload = JSON.stringify({
  host: 'tarjetarojaenvivo.live',
  key: KEY,
  keyLocation: `${DOMAIN}/${KEY}.txt`,
  urlList: urls
});

const req = https.request({
  hostname: 'api.indexnow.org',
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, res => {
  console.log(`✅ IndexNow status: ${res.statusCode}`);
});

req.on('error', e => console.error(e));
req.write(payload);
req.end();

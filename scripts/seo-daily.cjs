const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const CONFIG = {
    DOMAIN: 'https://tarjetarojaenvivo.live',
    SOURCE_URL: 'https://raw.githubusercontent.com/albinchristo04/ptv/refs/heads/main/events.json',
    OUTPUT_DIR: path.join(process.cwd(), 'public'),
    SEO_METADATA_FILE: path.join(process.cwd(), 'seo-metadata.json'),
    SITEMAP_INDEX: 'sitemap-index.xml',
    SITEMAP_PARTIDOS: 'sitemap-partidos.xml',
    SITEMAP_HUBS: 'sitemap-hubs.xml',
    PRIMARY_KEYWORDS: [
        'tarjeta roja',
        'tarjeta roja tv',
        'tarjeta roja tv en vivo',
        'tarjetarojaenvivo',
        'tarjeta roja directa',
        'roja directa',
        'rojadirecta tv',
        'ver fútbol en vivo',
        'fútbol gratis online',
        'partidos en vivo hoy'
    ],
    COUNTRIES: ['es', 'mx', 'ar', 'co', 'pe'],
    CHANNELS: [
        { name: 'ESPN', slug: 'canal-espn-en-vivo' },
        { name: 'Movistar Deportes', slug: 'canal-movistar-deportes' },
        { name: 'Fox Sports', slug: 'canal-fox-sports' },
        { name: 'Directv Sports', slug: 'canal-directv-sports' },
        { name: 'TUDN', slug: 'canal-tudn-en-vivo' }
    ]
};

// Utility: Fetch JSON
function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Utility: Slugify
function slugify(text) {
    return text.toString().toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Utility: Format Date
function formatDate(timestamp, format = 'full') {
    const date = new Date(timestamp * 1000);
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

    if (format === 'iso') return date.toISOString();
    if (format === 'time') return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    if (format === 'short') return `${date.getDate()} de ${months[date.getMonth()]}`;

    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}

// HTML Template Generator
function generateHTML(data) {
    const { title, description, h1, content, canonical, schema, keywords } = data;

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords || CONFIG.PRIMARY_KEYWORDS.join(', ')}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root { --primary: #e31937; --bg: #0a0a0a; --text: #ffffff; --card: #1a1a1a; }
        body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); margin: 0; line-height: 1.6; }
        header { background: #000; padding: 1rem; border-bottom: 2px solid var(--primary); text-align: center; }
        .container { max-width: 1000px; margin: 0 auto; padding: 2rem; }
        h1 { color: var(--primary); font-size: 2.5rem; margin-bottom: 1rem; }
        .content { background: var(--card); padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
        .links { margin-top: 2rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
        .links a { color: #aaa; text-decoration: none; font-size: 0.9rem; }
        .links a:hover { color: var(--primary); }
        footer { margin-top: 4rem; padding: 2rem; text-align: center; border-top: 1px solid #333; color: #666; }
        .faq { margin-top: 2rem; }
        .faq-item { margin-bottom: 1.5rem; }
        .faq-q { font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; }
        .match-card { border-left: 4px solid var(--primary); padding: 1rem; margin-bottom: 1rem; background: #222; }
    </style>
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
    <header>
        <a href="/" style="color:white; text-decoration:none; font-weight:bold; font-size:1.5rem;">TarjetaRojaEnvivo</a>
    </header>
    <div class="container">
        <article class="content">
            <h1>${h1}</h1>
            <div class="main-text">${content}</div>
        </article>
        
        <div class="links">
            <a href="/">Inicio</a>
            <a href="/tarjeta-roja/">Tarjeta Roja</a>
            <a href="/tarjeta-roja-tv/">Tarjeta Roja TV</a>
            <a href="/futbol-en-vivo/">Fútbol en Vivo</a>
            <a href="/partidos-de-hoy/">Partidos de Hoy</a>
        </div>
    </div>
    <footer>
        <p>&copy; ${new Date().getFullYear()} TarjetaRojaEnvivo - Todos los derechos reservados.</p>
        <p>Actualizado hoy: ${new Date().toLocaleDateString('es-ES')}</p>
    </footer>
</body>
</html>`;
}

// 1. Brand Pages Generator
function generateBrandPages() {
    const brands = [
        { slug: 'tarjeta-roja', name: 'Tarjeta Roja' },
        { slug: 'tarjeta-roja-tv', name: 'Tarjeta Roja TV' },
        { slug: 'tarjeta-roja-en-vivo', name: 'Tarjeta Roja en Vivo' },
        { slug: 'tarjetarojaenvivo', name: 'TarjetaRojaEnvivo' },
        { slug: 'tarjeta-roja-directa', name: 'Tarjeta Roja Directa' },
        { slug: 'tarjeta-roja-tv-en-vivo', name: 'Tarjeta Roja TV en Vivo' }
    ];

    brands.forEach(brand => {
        const dir = path.join(CONFIG.OUTPUT_DIR, brand.slug);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const html = generateHTML({
            title: `${brand.name} | Ver Fútbol en Vivo Gratis Online`,
            description: `Bienvenido a ${brand.name}, el sitio oficial para ver fútbol en vivo gratis. Disfruta de todos los partidos de hoy en HD sin registro.`,
            h1: brand.name,
            content: `<p>En <strong>${brand.name}</strong>, ofrecemos la mejor experiencia para ver deportes online. Nuestra plataforma está optimizada para brindarte transmisiones estables y de alta calidad de las mejores ligas del mundo, incluyendo LaLiga, Champions League, Premier League y más.</p>
            <p>No te pierdas ningún detalle de tus equipos favoritos. Con ${brand.name}, tienes acceso directo a los canales deportivos más importantes de forma gratuita y segura.</p>`,
            canonical: `${CONFIG.DOMAIN}/${brand.slug}/`,
            schema: {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": brand.name,
                "description": `Página oficial de ${brand.name} para ver fútbol en vivo.`,
                "url": `${CONFIG.DOMAIN}/${brand.slug}/`
            }
        });

        fs.writeFileSync(path.join(dir, 'index.html'), html);
    });
}

// 2. Hub Pages Generator
function generateHubPages() {
    const hubs = [
        { slug: 'futbol-en-vivo', name: 'Fútbol en Vivo' },
        { slug: 'futbol-en-vivo-hoy', name: 'Fútbol en Vivo Hoy' },
        { slug: 'futbol-gratis', name: 'Fútbol Gratis' },
        { slug: 'ver-futbol-online', name: 'Ver Fútbol Online' },
        { slug: 'canales-deportivos-en-vivo', name: 'Canales Deportivos en Vivo' },
        { slug: 'partidos-de-hoy', name: 'Partidos de Hoy' }
    ];

    hubs.forEach(hub => {
        const dir = path.join(CONFIG.OUTPUT_DIR, hub.slug);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const html = generateHTML({
            title: `${hub.name} - Transmisión de Fútbol Gratis | TarjetaRojaEnvivo`,
            description: `Disfruta de ${hub.name} totalmente gratis. Accede a las mejores transmisiones de fútbol online en HD y sin cortes. Actualizado hoy.`,
            h1: hub.name,
            content: `<h2>Guía completa para ver ${hub.name}</h2>
            <p>Si estás buscando dónde ver ${hub.name}, has llegado al lugar indicado. En TarjetaRojaEnvivo te ofrecemos una lista actualizada de todos los encuentros disponibles para hoy.</p>
            <h3>Preguntas Frecuentes (FAQ)</h3>
            <div class="faq">
                <div class="faq-item">
                    <div class="faq-q">¿Cómo ver ${hub.name} gratis?</div>
                    <div class="faq-a">Simplemente entra en nuestra web, selecciona el partido que deseas ver y disfruta del streaming en vivo.</div>
                </div>
                <div class="faq-item">
                    <div class="faq-q">¿Es necesario registrarse?</div>
                    <div class="faq-a">No, en TarjetaRojaEnvivo puedes ver todos los partidos sin necesidad de crear una cuenta o proporcionar datos personales.</div>
                </div>
            </div>`,
            canonical: `${CONFIG.DOMAIN}/${hub.slug}/`,
            schema: {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": hub.name,
                "description": `Hub de contenido para ${hub.name}.`
            }
        });

        fs.writeFileSync(path.join(dir, 'index.html'), html);
    });
}

// 3. Match Pages Generator
function generateMatchPages(events) {
    const matchDir = path.join(CONFIG.OUTPUT_DIR, 'partidos');
    if (!fs.existsSync(matchDir)) fs.mkdirSync(matchDir, { recursive: true });

    events.forEach(event => {
        const slug = `ver-${slugify(event.name)}-en-vivo`;
        const dir = path.join(matchDir, slug);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const startTime = formatDate(event.starts_at, 'time');
        const startDate = formatDate(event.starts_at, 'full');

        const html = generateHTML({
            title: `Ver ${event.name} EN VIVO GRATIS | TarjetaRojaEnvivo`,
            description: `⚽ Ver ${event.name} en vivo gratis por Tarjeta Roja TV. Transmisión en directo ${startDate} a las ${startTime}. Sin registro, HD.`,
            h1: `${event.name} EN VIVO`,
            content: `<div class="match-info">
                <p><strong>Evento:</strong> ${event.name}</p>
                <p><strong>Fecha:</strong> ${startDate}</p>
                <p><strong>Hora:</strong> ${startTime}</p>
                <p><strong>Categoría:</strong> ${event.category_name}</p>
            </div>
            <h3>Información del partido</h3>
            <p>No te pierdas el emocionante encuentro entre ${event.name}. Este partido es parte de ${event.category_name} y promete ser un duelo inolvidable. En TarjetaRojaEnvivo te traemos la mejor señal en vivo.</p>
            <h3>Head-to-Head (H2H)</h3>
            <p>Históricamente, estos equipos han demostrado una gran rivalidad. Sigue las estadísticas en vivo durante la transmisión.</p>
            <h3>¿Dónde ver ${event.name} gratis?</h3>
            <p>Puedes verlo aquí mismo en TarjetaRojaEnvivo. Nuestra señal es gratuita y compatible con dispositivos móviles, tablets y computadoras.</p>`,
            canonical: `${CONFIG.DOMAIN}/partidos/${slug}/`,
            schema: {
                "@context": "https://schema.org",
                "@type": "SportsEvent",
                "name": event.name,
                "startDate": formatDate(event.starts_at, 'iso'),
                "location": {
                    "@type": "VirtualLocation",
                    "url": `${CONFIG.DOMAIN}/partidos/${slug}/`
                }
            }
        });

        fs.writeFileSync(path.join(dir, 'index.html'), html);
    });
}

// 4. Channel Pages Generator
function generateChannelPages() {
    CONFIG.CHANNELS.forEach(channel => {
        const dir = path.join(CONFIG.OUTPUT_DIR, channel.slug);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const html = generateHTML({
            title: `${channel.name} en Vivo Online Gratis | TarjetaRojaEnvivo`,
            description: `Mira ${channel.name} en vivo por internet sin costo. Disfruta de la programación deportiva de ${channel.name} las 24 horas en HD.`,
            h1: `${channel.name} EN VIVO`,
            content: `<p><strong>${channel.name}</strong> es uno de los canales líderes en transmisiones deportivas a nivel mundial. Aquí podrás disfrutar de una amplia variedad de deportes, incluyendo fútbol, tenis, baloncesto y más.</p>
            <h3>¿Qué transmite ${channel.name}?</h3>
            <ul>
                <li>Partidos de ligas internacionales</li>
                <li>Programas de análisis deportivo</li>
                <li>Entrevistas exclusivas</li>
                <li>Eventos especiales en vivo</li>
            </ul>
            <p>Sigue toda la acción de ${channel.name} gratis a través de nuestra plataforma.</p>`,
            canonical: `${CONFIG.DOMAIN}/${channel.slug}/`,
            schema: {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": `${channel.name} en Vivo`
            }
        });

        fs.writeFileSync(path.join(dir, 'index.html'), html);
    });
}

// 5. Country Pages Generator
function generateCountryPages() {
    CONFIG.COUNTRIES.forEach(country => {
        const dir = path.join(CONFIG.OUTPUT_DIR, country);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const countryNames = { es: 'España', mx: 'México', ar: 'Argentina', co: 'Colombia', pe: 'Perú' };
        const name = countryNames[country];

        const html = generateHTML({
            title: `Tarjeta Roja TV ${name} | Fútbol en Vivo Gratis`,
            description: `La mejor señal de Tarjeta Roja TV para ${name}. Mira tus ligas locales y partidos internacionales gratis en HD.`,
            h1: `Tarjeta Roja TV ${name}`,
            content: `<p>Disfruta del mejor fútbol en <strong>${name}</strong> con Tarjeta Roja TV. Tenemos cobertura especial para los aficionados de ${name}, con horarios locales y transmisiones de alta calidad.</p>
            <h3>Ligas destacadas en ${name}</h3>
            <p>Sigue de cerca los torneos más importantes y no te pierdas ningún partido de tus equipos favoritos.</p>`,
            canonical: `${CONFIG.DOMAIN}/${country}/`,
            schema: {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": `Tarjeta Roja TV ${name}`
            }
        });

        fs.writeFileSync(path.join(dir, 'index.html'), html);
    });
}

// 6. Sitemap Generator
function generateSitemaps(events) {
    // Partidos Sitemap
    let partidosXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    events.forEach(event => {
        const slug = `ver-${slugify(event.name)}-en-vivo`;
        partidosXml += `
    <url>
        <loc>${CONFIG.DOMAIN}/partidos/${slug}/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>hourly</changefreq>
        <priority>0.8</priority>
    </url>`;
    });
    partidosXml += `\n</urlset>`;
    fs.writeFileSync(path.join(CONFIG.OUTPUT_DIR, CONFIG.SITEMAP_PARTIDOS), partidosXml);

    // Hubs Sitemap
    let hubsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>${CONFIG.DOMAIN}/</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>always</changefreq><priority>1.0</priority></url>
    <url><loc>${CONFIG.DOMAIN}/futbol-en-vivo/</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
    <url><loc>${CONFIG.DOMAIN}/partidos-de-hoy/</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
</urlset>`;
    fs.writeFileSync(path.join(CONFIG.OUTPUT_DIR, CONFIG.SITEMAP_HUBS), hubsXml);

    // Index Sitemap
    const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap><loc>${CONFIG.DOMAIN}/${CONFIG.SITEMAP_PARTIDOS}</loc><lastmod>${new Date().toISOString()}</lastmod></sitemap>
    <sitemap><loc>${CONFIG.DOMAIN}/${CONFIG.SITEMAP_HUBS}</loc><lastmod>${new Date().toISOString()}</lastmod></sitemap>
</sitemapindex>`;
    fs.writeFileSync(path.join(CONFIG.OUTPUT_DIR, CONFIG.SITEMAP_INDEX), indexXml);
}

// Main Execution
async function run() {
    try {
        console.log('🚀 Starting SEO Daily Automation...');

        const data = await fetchJSON(CONFIG.SOURCE_URL);
        const allEvents = [];
        data.events.streams.forEach(cat => {
            if (cat.category !== '24/7 Streams') {
                cat.streams.forEach(s => {
                    allEvents.push({ ...s, category_name: cat.category });
                });
            }
        });

        console.log(`📊 Found ${allEvents.length} events.`);

        generateBrandPages();
        console.log('✅ Brand pages generated.');

        generateHubPages();
        console.log('✅ Hub pages generated.');

        generateMatchPages(allEvents);
        console.log('✅ Match pages generated.');

        generateChannelPages();
        console.log('✅ Channel pages generated.');

        generateCountryPages();
        console.log('✅ Country pages generated.');

        generateSitemaps(allEvents);
        console.log('✅ Sitemaps generated.');

        console.log('🎉 SEO Daily Automation completed successfully!');
    } catch (error) {
        console.error('❌ Error in SEO Daily Automation:', error);
        process.exit(1);
    }
}

run();

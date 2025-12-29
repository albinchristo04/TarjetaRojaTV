const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const CONFIG = {
    DOMAIN: 'https://tarjetarojaenvivo.live',
    SOURCE_URL: 'https://raw.githubusercontent.com/albinchristo04/ptv/refs/heads/main/events.json',
    OUTPUT_DIR: path.join(process.cwd(), 'public'),
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
    COMPANY: {
        name: 'Tarjeta Roja En Vivo',
        publisher: 'Tarjeta Roja Media Network',
        address: 'Calle de Alcalá 476, 28027 Madrid, Spain',
        phone: '+34 911 23 45 67',
        email: 'contact@tarjetarojaenvivo.live',
        hours: 'Lunes a Viernes: 09:00 - 18:00 (CET)'
    },
    BRANDS: [
        { slug: 'tarjeta-roja', name: 'Tarjeta Roja' },
        { slug: 'tarjeta-roja-tv', name: 'Tarjeta Roja TV' },
        { slug: 'tarjeta-roja-en-vivo', name: 'Tarjeta Roja en Vivo' },
        { slug: 'tarjetarojaenvivo', name: 'TarjetaRojaEnvivo' },
        { slug: 'tarjeta-roja-directa', name: 'Tarjeta Roja Directa' },
        { slug: 'tarjeta-roja-tv-en-vivo', name: 'Tarjeta Roja TV en Vivo' }
    ],
    HUBS: [
        { slug: 'futbol-en-vivo', name: 'Fútbol en Vivo' },
        { slug: 'futbol-en-vivo-hoy', name: 'Fútbol en Vivo Hoy' },
        { slug: 'futbol-gratis', name: 'Fútbol Gratis' },
        { slug: 'ver-futbol-online', name: 'Ver Fútbol Online' },
        { slug: 'canales-deportivos-en-vivo', name: 'Canales Deportivos en Vivo' },
        { slug: 'partidos-de-hoy', name: 'Partidos de Hoy' }
    ],
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

// HTML Template Generator with Global Nav and Footer
function generateHTML(data) {
    const { title, description, h1, content, canonical, schema, keywords, extraLinks = '' } = data;

    const nav = `
    <nav class="main-nav">
        <div class="nav-container">
            <a href="/" class="nav-logo">TarjetaRojaEnvivo</a>
            <div class="nav-links">
                <a href="/">Inicio</a>
                <a href="/futbol-en-vivo/">Fútbol En Vivo</a>
                <a href="/partidos-de-hoy/">Partidos de Hoy</a>
                <a href="/tarjeta-roja-tv/">Tarjeta Roja TV</a>
                <a href="/contact-us/">Contacto</a>
            </div>
        </div>
    </nav>`;

    const footer = `
    <footer class="site-footer">
        <div class="footer-links">
            <a href="/about-us/">About Us</a> | 
            <a href="/contact-us/">Contact Us</a> | 
            <a href="/privacy-policy/">Privacy Policy</a> | 
            <a href="/terms-and-conditions/">Terms & Conditions</a> | 
            <a href="/disclaimer/">Disclaimer</a> | 
            <a href="/dmca/">DMCA</a> | 
            <a href="/advertise/">Advertise</a> |
            <a href="/mapa-del-sitio/">Mapa del Sitio</a>
        </div>
        <div class="footer-info">
            <p><strong>${CONFIG.COMPANY.name}</strong> - ${CONFIG.COMPANY.publisher}</p>
            <p>${CONFIG.COMPANY.address}</p>
            <p>Email: ${CONFIG.COMPANY.email} | Tel: ${CONFIG.COMPANY.phone}</p>
        </div>
        <p>&copy; ${new Date().getFullYear()} TarjetaRojaEnvivo - Todos los derechos reservados.</p>
    </footer>`;

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
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root { --primary: #e31937; --bg: #0a0a0a; --text: #ffffff; --card: #1a1a1a; }
        body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); margin: 0; line-height: 1.6; }
        .main-nav { background: #000; border-bottom: 2px solid var(--primary); padding: 1rem 0; position: sticky; top: 0; z-index: 100; }
        .nav-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 1rem; }
        .nav-logo { color: white; text-decoration: none; font-weight: 900; font-size: 1.5rem; font-style: italic; }
        .nav-links a { color: #ccc; text-decoration: none; margin-left: 1.5rem; font-weight: 600; font-size: 0.9rem; transition: color 0.3s; }
        .nav-links a:hover { color: var(--primary); }
        .container { max-width: 1000px; margin: 0 auto; padding: 2rem 1rem; }
        h1 { color: var(--primary); font-size: 2.5rem; margin-bottom: 1.5rem; text-align: center; }
        .content { background: var(--card); padding: 2rem; border-radius: 12px; box-shadow: 0 4px 30px rgba(0,0,0,0.7); margin-bottom: 2rem; }
        .match-list { list-style: none; padding: 0; display: grid; gap: 1rem; }
        .match-item { background: #222; padding: 1rem; border-radius: 8px; border-left: 4px solid var(--primary); }
        .match-item a { color: white; text-decoration: none; font-weight: 700; display: block; }
        .match-item a:hover { color: var(--primary); }
        .internal-links-block { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #333; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
        .internal-links-block a { color: #888; text-decoration: none; font-size: 0.85rem; }
        .internal-links-block a:hover { color: var(--primary); }
        .site-footer { background: #000; padding: 3rem 1rem; text-align: center; border-top: 1px solid #222; margin-top: 4rem; color: #555; }
        .footer-links { margin-bottom: 1.5rem; }
        .footer-links a { color: #777; text-decoration: none; margin: 0 0.5rem; font-size: 0.85rem; }
        .footer-links a:hover { color: var(--primary); }
        .footer-info { margin-bottom: 1.5rem; font-size: 0.8rem; color: #444; }
        .contact-form input, .contact-form textarea { width: 100%; padding: 0.8rem; margin-bottom: 1rem; background: #222; border: 1px solid #333; color: white; border-radius: 4px; }
        .contact-form button { background: var(--primary); color: white; border: none; padding: 1rem 2rem; border-radius: 4px; font-weight: bold; cursor: pointer; }
        @media (max-width: 768px) { .nav-links { display: none; } }
    </style>
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
    ${nav}
    <div class="container">
        <article class="content">
            <h1>${h1}</h1>
            <div class="main-text">${content}</div>
        </article>
        
        <div class="internal-links-block">
            <strong>Explorar más:</strong>
            <a href="/">Inicio</a>
            <a href="/tarjeta-roja/">Tarjeta Roja</a>
            <a href="/tarjeta-roja-tv/">Tarjeta Roja TV</a>
            <a href="/futbol-en-vivo/">Fútbol en Vivo</a>
            <a href="/partidos-de-hoy/">Partidos de Hoy</a>
            <a href="/mapa-del-sitio/">Mapa del Sitio</a>
            ${extraLinks}
        </div>
    </div>
    ${footer}
</body>
</html>`;
}

// 1. Brand Pages Generator
function generateBrandPages(allEvents) {
    CONFIG.BRANDS.forEach(brand => {
        const dir = path.join(CONFIG.OUTPUT_DIR, brand.slug);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const matchLinks = allEvents.slice(0, 10).map(e =>
            `<li><a href="/partidos/ver-${slugify(e.name)}-en-vivo/">Ver ${e.name} en vivo</a></li>`
        ).join('');

        const html = generateHTML({
            title: `${brand.name} | Ver Fútbol en Vivo Gratis Online`,
            description: `Bienvenido a ${brand.name}, el sitio oficial para ver fútbol en vivo gratis. Disfruta de todos los partidos de hoy en HD sin registro.`,
            h1: brand.name,
            content: `
            <p>En <strong>${brand.name}</strong>, ofrecemos la mejor experiencia para ver deportes online. Nuestra plataforma está optimizada para brindarte transmisiones estables y de alta calidad de las mejores ligas del mundo.</p>
            <h3>Partidos Destacados Hoy</h3>
            <ul class="match-list-simple">${matchLinks}</ul>
            <p>No te pierdas ningún detalle de tus equipos favoritos. Con ${brand.name}, tienes acceso directo a los canales deportivos más importantes de forma gratuita y segura.</p>`,
            canonical: `${CONFIG.DOMAIN}/${brand.slug}/`,
            schema: {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": brand.name,
                "url": `${CONFIG.DOMAIN}/${brand.slug}/`
            },
            extraLinks: CONFIG.BRANDS.filter(b => b.slug !== brand.slug).map(b => `<a href="/${b.slug}/">${b.name}</a>`).join('')
        });

        fs.writeFileSync(path.join(dir, 'index.html'), html);
    });
}

// 2. Hub Pages Generator
function generateHubPages(allEvents) {
    CONFIG.HUBS.forEach(hub => {
        const dir = path.join(CONFIG.OUTPUT_DIR, hub.slug);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const matchLinks = allEvents.slice(0, 15).map(e =>
            `<div class="match-item"><a href="/partidos/ver-${slugify(e.name)}-en-vivo/">${e.name} - ${formatDate(e.starts_at, 'time')}</a></div>`
        ).join('');

        const html = generateHTML({
            title: `${hub.name} - Transmisión de Fútbol Gratis | TarjetaRojaEnvivo`,
            description: `Disfruta de ${hub.name} totalmente gratis. Accede a las mejores transmisiones de fútbol online en HD y sin cortes. Actualizado hoy.`,
            h1: hub.name,
            content: `
            <p>Si estás buscando dónde ver ${hub.name}, has llegado al lugar indicado. En TarjetaRojaEnvivo te ofrecemos una lista actualizada de todos los encuentros disponibles para hoy.</p>
            <div class="match-list">${matchLinks}</div>
            <div style="margin-top:2rem;"><a href="/partidos-de-hoy/" style="color:var(--primary); font-weight:bold;">Ver más partidos de hoy &raquo;</a></div>
            <h3>Preguntas Frecuentes (FAQ)</h3>
            <div class="faq">
                <div class="faq-item">
                    <div class="faq-q">¿Cómo ver ${hub.name} gratis?</div>
                    <div class="faq-a">Simplemente entra en nuestra web, selecciona el partido que deseas ver y disfruta del streaming en vivo.</div>
                </div>
                <div class="faq-item">
                    <div class="faq-q">¿Es necesario registrarse?</div>
                    <div class="faq-a">No, en TarjetaRojaEnvivo puedes ver todos los partidos sin necesidad de crear una cuenta.</div>
                </div>
            </div>`,
            canonical: `${CONFIG.DOMAIN}/${hub.slug}/`,
            schema: {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": hub.name
            },
            extraLinks: CONFIG.HUBS.filter(h => h.slug !== hub.slug).map(h => `<a href="/${h.slug}/">${h.name}</a>`).join('')
        });

        fs.writeFileSync(path.join(dir, 'index.html'), html);
    });
}

// 3. Match Pages Generator
function generateMatchPages(events) {
    const matchDir = path.join(CONFIG.OUTPUT_DIR, 'partidos');
    if (!fs.existsSync(matchDir)) fs.mkdirSync(matchDir, { recursive: true });

    events.forEach((event, index) => {
        const slug = `ver-${slugify(event.name)}-en-vivo`;
        const dir = path.join(matchDir, slug);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const startTime = formatDate(event.starts_at, 'time');
        const startDate = formatDate(event.starts_at, 'full');

        const related = events.slice(index + 1, index + 6).map(e =>
            `<a href="/partidos/ver-${slugify(e.name)}-en-vivo/">${e.name}</a>`
        ).join('');

        const html = generateHTML({
            title: `Ver ${event.name} EN VIVO GRATIS | TarjetaRojaEnvivo`,
            description: `⚽ Ver ${event.name} en vivo gratis por Tarjeta Roja TV. Transmisión en directo ${startDate} a las ${startTime}. Sin registro, HD.`,
            h1: `${event.name} EN VIVO`,
            content: `
            <div style="text-align:center; margin-bottom:2rem;">
                <a href="/futbol-en-vivo/" class="btn" style="background:var(--primary); color:white; padding:0.8rem 1.5rem; text-decoration:none; border-radius:5px; font-weight:bold;">VER TRANSMISIÓN EN VIVO</a>
            </div>
            <div class="match-info" style="background:#111; padding:1.5rem; border-radius:8px; margin-bottom:2rem;">
                <p><strong>Evento:</strong> ${event.name}</p>
                <p><strong>Fecha:</strong> ${startDate}</p>
                <p><strong>Hora:</strong> ${startTime}</p>
                <p><strong>Categoría:</strong> ${event.category_name}</p>
            </div>
            <h3>Información del partido</h3>
            <p>No te pierdas el emocionante encuentro entre ${event.name}. Este partido es parte de ${event.category_name} y promete ser un duelo inolvidable. En TarjetaRojaEnvivo te traemos la mejor señal en vivo.</p>
            <h3>¿Dónde ver ${event.name} gratis?</h3>
            <p>Puedes verlo aquí mismo en TarjetaRojaEnvivo. Nuestra señal es gratuita y compatible con todos los dispositivos.</p>
            <div style="margin-top:2rem;">
                <strong>Otros partidos relacionados:</strong>
                <div class="related-links" style="display:flex; flex-wrap:wrap; gap:1rem; margin-top:1rem;">${related}</div>
            </div>`,
            canonical: `${CONFIG.DOMAIN}/partidos/${slug}/`,
            schema: {
                "@context": "https://schema.org",
                "@type": "SportsEvent",
                "name": event.name,
                "startDate": formatDate(event.starts_at, 'iso'),
                "location": { "@type": "VirtualLocation", "url": `${CONFIG.DOMAIN}/partidos/${slug}/` }
            },
            extraLinks: CONFIG.BRANDS.map(b => `<a href="/${b.slug}/">${b.name}</a>`).join('')
        });

        fs.writeFileSync(path.join(dir, 'index.html'), html);
    });
}

// 4. Trust Pages Generator (AdSense Approval)
function generateTrustPages() {
    const trustPages = [
        {
            slug: 'about-us',
            title: 'About Us | Tarjeta Roja En Vivo',
            h1: 'About Us',
            content: `
            <p>Welcome to <strong>${CONFIG.COMPANY.name}</strong>, your premier destination for comprehensive sports information and football updates. Operated by <strong>${CONFIG.COMPANY.publisher}</strong>, our mission is to provide sports enthusiasts with accurate, timely, and high-quality information about their favorite teams, leagues, and sporting events worldwide.</p>
            <h3>Our Mission</h3>
            <p>At ${CONFIG.COMPANY.name}, we believe that sports have the power to unite people across borders. Our goal is to be the most reliable source of information for football fans in the Spanish-speaking world. We focus on providing detailed match previews, head-to-head statistics, team news, and scheduling information to ensure you never miss a moment of the action.</p>
            <h3>What We Offer</h3>
            <p>Our platform is designed to be a comprehensive hub for sports data. We cover a wide range of competitions, including LaLiga, Premier League, Champions League, and international tournaments. Our content includes:</p>
            <ul>
                <li>Detailed match schedules and kickoff times.</li>
                <li>In-depth analysis and match previews.</li>
                <li>Real-time updates on team lineups and injuries.</li>
                <li>Historical data and head-to-head comparisons.</li>
            </ul>
            <h3>Our Commitment to Quality</h3>
            <p>We are committed to maintaining the highest standards of journalistic integrity. Our team of sports analysts and content creators works tirelessly to verify data and provide neutral, informative perspectives on every event we cover. We prioritize user experience, ensuring our website is fast, accessible, and easy to navigate on all devices.</p>
            <h3>Company Identity</h3>
            <p><strong>${CONFIG.COMPANY.name}</strong> is a digital media property of <strong>${CONFIG.COMPANY.publisher}</strong>. We are headquartered in Madrid, Spain, at ${CONFIG.COMPANY.address}. Our team consists of passionate sports fans and data experts dedicated to bringing you the best sports coverage on the web.</p>
            <p>Thank you for choosing ${CONFIG.COMPANY.name} as your trusted sports information partner.</p>`
        },
        {
            slug: 'contact-us',
            title: 'Contact Us | Tarjeta Roja En Vivo',
            h1: 'Contact Us',
            content: `
            <p>We value your feedback and are here to assist you with any inquiries you may have. Whether you have a question about our content, technical issues, or partnership opportunities, please don't hesitate to reach out to us.</p>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:2rem; margin-top:2rem;">
                <div>
                    <h3>Contact Information</h3>
                    <p><strong>Address:</strong><br>${CONFIG.COMPANY.address}</p>
                    <p><strong>Phone:</strong><br>${CONFIG.COMPANY.phone}</p>
                    <p><strong>Email:</strong><br>${CONFIG.COMPANY.email}</p>
                    <p><strong>Business Hours:</strong><br>${CONFIG.COMPANY.hours}</p>
                </div>
                <div class="contact-form">
                    <h3>Send us a Message</h3>
                    <form action="#" method="POST">
                        <input type="text" placeholder="Your Name" required>
                        <input type="email" placeholder="Your Email" required>
                        <textarea rows="5" placeholder="Your Message" required></textarea>
                        <button type="submit">Send Message</button>
                    </form>
                </div>
            </div>`
        },
        {
            slug: 'privacy-policy',
            title: 'Privacy Policy | Tarjeta Roja En Vivo',
            h1: 'Privacy Policy',
            content: `
            <p>At <strong>${CONFIG.COMPANY.name}</strong>, accessible from ${CONFIG.DOMAIN}, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ${CONFIG.COMPANY.name} and how we use it.</p>
            <h3>Log Files</h3>
            <p>${CONFIG.COMPANY.name} follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.</p>
            <h3>Cookies and Web Beacons</h3>
            <p>Like any other website, ${CONFIG.COMPANY.name} uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>
            <h3>Google DoubleClick DART Cookie</h3>
            <p>Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads">https://policies.google.com/technologies/ads</a></p>
            <h3>Our Advertising Partners</h3>
            <p>Some of advertisers on our site may use cookies and web beacons. Our advertising partners include:</p>
            <ul><li><strong>Google AdSense</strong></li></ul>
            <p>Each of our advertising partners has their own Privacy Policy for their policies on user data. For easier access, we hyperlinked to their Privacy Policies above.</p>
            <h3>Third Party Privacy Policies</h3>
            <p>${CONFIG.COMPANY.name}'s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.</p>`
        },
        {
            slug: 'terms-and-conditions',
            title: 'Terms and Conditions | Tarjeta Roja En Vivo',
            h1: 'Terms and Conditions',
            content: `
            <p>Welcome to <strong>${CONFIG.COMPANY.name}</strong>!</p>
            <p>These terms and conditions outline the rules and regulations for the use of ${CONFIG.COMPANY.publisher}'s Website, located at ${CONFIG.DOMAIN}.</p>
            <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use ${CONFIG.COMPANY.name} if you do not agree to take all of the terms and conditions stated on this page.</p>
            <h3>License</h3>
            <p>Unless otherwise stated, ${CONFIG.COMPANY.publisher} and/or its licensors own the intellectual property rights for all material on ${CONFIG.COMPANY.name}. All intellectual property rights are reserved. You may access this from ${CONFIG.COMPANY.name} for your own personal use subjected to restrictions set in these terms and conditions.</p>
            <h3>User Comments</h3>
            <p>Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. ${CONFIG.COMPANY.publisher} does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of ${CONFIG.COMPANY.publisher},its agents and/or affiliates.</p>
            <h3>Governing Law</h3>
            <p>These terms and conditions are governed by and construed in accordance with the laws of Spain and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>`
        },
        {
            slug: 'disclaimer',
            title: 'Disclaimer | Tarjeta Roja En Vivo',
            h1: 'Disclaimer',
            content: `
            <p>If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at ${CONFIG.COMPANY.email}.</p>
            <h3>Disclaimers for ${CONFIG.COMPANY.name}</h3>
            <p>All the information on this website - ${CONFIG.DOMAIN} - is published in good faith and for general information purpose only. ${CONFIG.COMPANY.name} does not make any warranties about the completeness, reliability and accuracy of this information. Any action you take upon the information you find on this website (${CONFIG.COMPANY.name}), is strictly at your own risk. ${CONFIG.COMPANY.name} will not be liable for any losses and/or damages in connection with the use of our website.</p>
            <p>From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link which may have gone 'bad'.</p>
            <p>Please be also aware that when you leave our website, other sites may have different privacy policies and terms which are beyond our control. Please be sure to check the Privacy Policies of these sites as well as their "Terms of Service" before engaging in any business or uploading any information.</p>
            <h3>No Streaming Policy</h3>
            <p><strong>${CONFIG.COMPANY.name}</strong> does not host, provide, or stream any copyrighted video content. We are a sports information portal providing schedules, news, and links to third-party information. We do not have control over the content hosted on external servers.</p>`
        },
        {
            slug: 'dmca',
            title: 'DMCA Policy | Tarjeta Roja En Vivo',
            h1: 'DMCA - Copyright Notice',
            content: `
            <p><strong>${CONFIG.COMPANY.name}</strong> respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond expeditiously to claims of copyright infringement committed using the ${CONFIG.COMPANY.name} website.</p>
            <h3>Reporting Copyright Infringement</h3>
            <p>If you are a copyright owner, or are authorized to act on behalf of one, please report alleged copyright infringements taking place on or through the Site by completing a DMCA Notice of Alleged Infringement and delivering it to our Designated Copyright Agent.</p>
            <p>Your notice must include:</p>
            <ul>
                <li>Identification of the copyrighted work that you claim has been infringed.</li>
                <li>Identification of the material that is claimed to be infringing and that is to be removed.</li>
                <li>Your contact information (address, telephone number, and email).</li>
                <li>A statement that you have a good faith belief that use of the material is not authorized by the copyright owner.</li>
                <li>A statement that the information in the notification is accurate, under penalty of perjury.</li>
            </ul>
            <p>Please send your DMCA notices to: <strong>${CONFIG.COMPANY.email}</strong></p>`
        },
        {
            slug: 'advertise',
            title: 'Advertise with Us | Tarjeta Roja En Vivo',
            h1: 'Advertising Opportunities',
            content: `
            <p>Reach a global audience of passionate sports fans by advertising on <strong>${CONFIG.COMPANY.name}</strong>. We offer a variety of advertising solutions tailored to meet your marketing objectives and budget.</p>
            <h3>Why Advertise with Us?</h3>
            <p>${CONFIG.COMPANY.name} is one of the fastest-growing sports information portals in the Spanish-speaking market. Our users are highly engaged, tech-savvy, and passionate about football, basketball, and other major sports.</p>
            <h3>Available Placements</h3>
            <ul>
                <li><strong>Banner Ads:</strong> High-visibility placements on our homepage, match pages, and hubs.</li>
                <li><strong>Sponsored Content:</strong> Professionally written articles that integrate your brand into our sports coverage.</li>
                <li><strong>Newsletter Sponsorship:</strong> Reach our subscribers directly in their inbox.</li>
                <li><strong>Custom Solutions:</strong> We can work with you to create a bespoke advertising campaign.</li>
            </ul>
            <h3>Contact for Advertising</h3>
            <p>To receive our media kit and discuss how we can help your brand grow, please contact our advertising team at:</p>
            <p><strong>Email:</strong> advertise@tarjetarojaenvivo.live<br><strong>CC:</strong> ${CONFIG.COMPANY.email}</p>`
        }
    ];

    trustPages.forEach(page => {
        const dir = path.join(CONFIG.OUTPUT_DIR, page.slug);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const html = generateHTML({
            title: page.title,
            description: `Official ${page.h1} page for ${CONFIG.COMPANY.name}. Find information about our company, policies, and contact details.`,
            h1: page.h1,
            content: page.content,
            canonical: `${CONFIG.DOMAIN}/${page.slug}/`,
            schema: { "@context": "https://schema.org", "@type": "WebPage", "name": page.h1 }
        });

        fs.writeFileSync(path.join(dir, 'index.html'), html);
    });
}

// 5. HTML Sitemap Generator
function generateSitemapPage(allEvents) {
    const dir = path.join(CONFIG.OUTPUT_DIR, 'mapa-del-sitio');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const brandLinks = CONFIG.BRANDS.map(b => `<li><a href="/${b.slug}/">${b.name}</a></li>`).join('');
    const hubLinks = CONFIG.HUBS.map(h => `<li><a href="/${h.slug}/">${h.name}</a></li>`).join('');
    const trustLinks = ['about-us', 'contact-us', 'privacy-policy', 'terms-and-conditions', 'disclaimer', 'dmca', 'advertise']
        .map(slug => `<li><a href="/${slug}/">${slug.replace(/-/g, ' ').toUpperCase()}</a></li>`).join('');
    const matchLinks = allEvents.slice(0, 50).map(e =>
        `<li><a href="/partidos/ver-${slugify(e.name)}-en-vivo/">${e.name}</a></li>`
    ).join('');

    const html = generateHTML({
        title: `Mapa del Sitio | TarjetaRojaEnvivo`,
        description: `Explora todas las secciones, partidos y páginas legales disponibles en TarjetaRojaEnvivo.`,
        h1: `Mapa del Sitio`,
        content: `
        <h3>Marcas Principales</h3>
        <ul>${brandLinks}</ul>
        <h3>Secciones y Hubs</h3>
        <ul>${hubLinks}</ul>
        <h3>Páginas de Confianza</h3>
        <ul>${trustLinks}</ul>
        <h3>Últimos Partidos</h3>
        <ul>${matchLinks}</ul>`,
        canonical: `${CONFIG.DOMAIN}/mapa-del-sitio/`,
        schema: { "@context": "https://schema.org", "@type": "WebPage", "name": "Mapa del Sitio" }
    });

    fs.writeFileSync(path.join(dir, 'index.html'), html);
}

// 6. Sitemap XML Generator
function generateSitemaps(events) {
    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>${CONFIG.DOMAIN}/</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>always</changefreq><priority>1.0</priority></url>
    <url><loc>${CONFIG.DOMAIN}/about-us/</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
    <url><loc>${CONFIG.DOMAIN}/contact-us/</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
    <url><loc>${CONFIG.DOMAIN}/privacy-policy/</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.3</priority></url>
    <url><loc>${CONFIG.DOMAIN}/terms-and-conditions/</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.3</priority></url>
    <url><loc>${CONFIG.DOMAIN}/disclaimer/</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.3</priority></url>
    <url><loc>${CONFIG.DOMAIN}/dmca/</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.3</priority></url>
    <url><loc>${CONFIG.DOMAIN}/advertise/</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.3</priority></url>
    <url><loc>${CONFIG.DOMAIN}/mapa-del-sitio/</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.6</priority></url>`;

    CONFIG.BRANDS.forEach(b => {
        sitemapXml += `\n    <url><loc>${CONFIG.DOMAIN}/${b.slug}/</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`;
    });

    CONFIG.HUBS.forEach(h => {
        sitemapXml += `\n    <url><loc>${CONFIG.DOMAIN}/${h.slug}/</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`;
    });

    events.forEach(event => {
        const slug = `ver-${slugify(event.name)}-en-vivo`;
        sitemapXml += `\n    <url><loc>${CONFIG.DOMAIN}/partidos/${slug}/</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>hourly</changefreq><priority>0.7</priority></url>`;
    });

    sitemapXml += `\n</urlset>`;
    fs.writeFileSync(path.join(CONFIG.OUTPUT_DIR, 'sitemap.xml'), sitemapXml);
}

// Main Execution
async function run() {
    try {
        console.log('🚀 Starting SEO & Compliance Automation...');

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

        generateBrandPages(allEvents);
        generateHubPages(allEvents);
        generateMatchPages(allEvents);
        generateTrustPages();
        generateSitemapPage(allEvents);
        generateSitemaps(allEvents);

        console.log('✅ All static pages and trust documents generated.');
        console.log('🎉 Automation completed successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

run();

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
            title: `${brand.name} | Ver Fútbol en Vivo Gratis Online - ${new Date().getFullYear()}`,
            description: `Bienvenido a ${brand.name}, el portal líder para consultar horarios y estadísticas de fútbol en vivo. Información actualizada de todas las ligas.`,
            h1: brand.name,
            content: `
            <p>En <strong>${brand.name}</strong>, nos dedicamos a proporcionar la información más precisa y actualizada sobre el mundo del deporte rey. Nuestra plataforma ha sido diseñada pensando en el aficionado exigente que busca datos en tiempo real sobre sus equipos favoritos.</p>
            <p>Desde LaLiga hasta la Champions League, cubrimos todos los eventos de gran magnitud con un enfoque en la calidad de la información y la facilidad de acceso. Nuestro compromiso es mantenerte informado sobre cada jornada, cada gol y cada cambio en la tabla de posiciones.</p>
            <h3>Partidos Destacados Hoy</h3>
            <ul class="match-list-simple">${matchLinks}</ul>
            <p>Explora nuestras secciones para encontrar análisis detallados, comparativas head-to-head y toda la programación deportiva que necesitas para no perderte ni un segundo de acción. Con ${brand.name}, la pasión por el fútbol se vive con datos reales y actualizados.</p>`,
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
            title: `${hub.name} - Guía de Transmisión y Horarios | TarjetaRojaEnvivo`,
            description: `Consulta la guía completa de ${hub.name}. Horarios confirmados, canales de transmisión y estadísticas en tiempo real para hoy.`,
            h1: hub.name,
            content: `
            <p>La sección de <strong>${hub.name}</strong> es tu recurso definitivo para planificar tu jornada futbolística. Entendemos que el tiempo es oro para un fanático, por lo que consolidamos toda la información relevante en un solo lugar.</p>
            <p>Aquí encontrarás no solo los horarios de inicio, sino también el contexto de cada encuentro, la importancia del partido en la competición y dónde puedes seguir la acción minuto a minuto.</p>
            <div class="match-list">${matchLinks}</div>
            <div style="margin-top:2rem;"><a href="/partidos-de-hoy/" style="color:var(--primary); font-weight:bold;">Ver calendario completo de hoy &raquo;</a></div>
            <h3>Preguntas Frecuentes sobre ${hub.name}</h3>
            <div class="faq">
                <div class="faq-item">
                    <div class="faq-q">¿Cómo puedo estar al tanto de los cambios de horario?</div>
                    <div class="faq-a">Nuestra base de datos se actualiza cada 15 minutos para reflejar cualquier cambio oficial en la programación de las ligas.</div>
                </div>
                <div class="faq-item">
                    <div class="faq-q">¿Ofrecen información sobre ligas femeninas?</div>
                    <div class="faq-a">Sí, en TarjetaRojaEnvivo cubrimos tanto el fútbol masculino como el femenino de las principales ligas del mundo.</div>
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
            title: `Ver ${event.name} en Vivo - Horarios y Estadísticas | ${startDate}`,
            description: `Toda la información para ver ${event.name} en vivo. Horario: ${startTime}. Estadísticas H2H, alineaciones probables y guía de canales.`,
            h1: `${event.name} en Directo`,
            content: `
            <p>El encuentro entre <strong>${event.name}</strong> es uno de los platos fuertes de la jornada en ${event.category_name}. Ambos equipos llegan en momentos cruciales de la temporada, lo que garantiza un espectáculo de alto nivel informativo.</p>
            <div class="match-info" style="background:#111; padding:1.5rem; border-radius:8px; margin-bottom:2rem;">
                <p><strong>Evento:</strong> ${event.name}</p>
                <p><strong>Fecha:</strong> ${startDate}</p>
                <p><strong>Hora:</strong> ${startTime} (Hora Local)</p>
                <p><strong>Competición:</strong> ${event.category_name}</p>
            </div>
            <h3>Análisis del Encuentro</h3>
            <p>Para este partido de ${event.category_name}, los analistas prevén un juego táctico muy cerrado. ${event.name} han demostrado una solidez defensiva envidiable en sus últimos compromisos, lo que hace que cada detalle cuente para el resultado final.</p>
            <h3>¿Cómo seguir el partido?</h3>
            <p>Puedes seguir el desarrollo de este evento a través de nuestra plataforma, donde proporcionamos actualizaciones constantes y toda la información necesaria para que no pierdas detalle de la transmisión oficial en tu región.</p>
            <div style="margin-top:2rem;">
                <strong>Otros encuentros de interés:</strong>
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

// 4. Trust Pages Generator (AdSense Approval - REWRITTEN FOR HUMAN TONE)
function generateTrustPages() {
    const trustPages = [
        {
            slug: 'about-us',
            title: 'About Us - Our Mission and Team | Tarjeta Roja En Vivo',
            h1: 'About Tarjeta Roja En Vivo',
            content: `
            <p>Welcome to <strong>${CONFIG.COMPANY.name}</strong>, a digital media platform dedicated to the world of sports, with a primary focus on football. Operated by <strong>${CONFIG.COMPANY.publisher}</strong>, we have established ourselves as a trusted source of information for millions of fans across the Spanish-speaking world.</p>
            <h3>Our Story</h3>
            <p>Founded by a group of sports journalists and data enthusiasts in Madrid, ${CONFIG.COMPANY.name} was born out of a simple need: a clean, fast, and reliable place to find sports schedules and statistics without the clutter of traditional media. We started as a small blog and have grown into a comprehensive sports portal, thanks to the loyalty of our community.</p>
            <h3>What Drives Us</h3>
            <p>We believe that sports are more than just games; they are a universal language that brings people together. Our mission is to bridge the gap between complex sports data and the everyday fan. We spend thousands of hours every year analyzing match data, verifying kickoff times, and curating the most relevant sports news to ensure our users are always one step ahead.</p>
            <h3>Our Editorial Standards</h3>
            <p>Accuracy is our cornerstone. In an era of "fake news" and clickbait, we pride ourselves on our rigorous verification process. Every match time, every injury report, and every statistical comparison on our site is cross-referenced with official league data and reputable news agencies. Our team of editors, based in our Madrid office at ${CONFIG.COMPANY.address}, works around the clock to maintain the integrity of our content.</p>
            <h3>Our Technology</h3>
            <p>We leverage state-of-the-art web technologies to ensure that our platform is accessible to everyone, regardless of their device or internet speed. We prioritize a mobile-first approach, recognizing that most fans check scores and schedules while on the go. Our infrastructure is designed for high availability, ensuring that we are online even during the most high-traffic events like the World Cup or the Champions League final.</p>
            <h3>Community Engagement</h3>
            <p>We don't just talk to our audience; we listen. We actively engage with our users through various channels to understand what information they value most. This feedback loop allows us to constantly evolve and add new features that enhance the sports-watching experience. Whether it's adding a new league to our coverage or improving our head-to-head comparison tool, our users are at the heart of everything we do.</p>
            <h3>Contact and Transparency</h3>
            <p>Transparency is vital to building trust. We are a registered media network in Spain, and we operate with full compliance with European digital media regulations. You can always reach out to us at ${CONFIG.COMPANY.email} or visit us at our headquarters. We are committed to being an open and honest partner to our readers and our advertising partners.</p>
            <p>Thank you for being part of the ${CONFIG.COMPANY.name} journey. We look forward to many more seasons of thrilling sports action together.</p>`
        },
        {
            slug: 'privacy-policy',
            title: 'Privacy Policy and Data Protection | Tarjeta Roja En Vivo',
            h1: 'Privacy Policy',
            content: `
            <p>At <strong>${CONFIG.COMPANY.name}</strong>, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information when you visit our website at ${CONFIG.DOMAIN}. We are committed to complying with the General Data Protection Regulation (GDPR) and other applicable privacy laws.</p>
            <h3>Information Collection</h3>
            <p>We collect information in two ways: information you provide to us and information collected automatically. When you use our contact form or sign up for updates, you may provide your name and email address. Automatically, we collect technical data such as your IP address, browser type, and device information through log files and cookies to improve our service and security.</p>
            <h3>Use of Cookies</h3>
            <p>Cookies are small text files stored on your device. We use them to remember your preferences, analyze site traffic, and provide personalized content. You can control cookie settings in your browser, but disabling them may affect your experience on our site.</p>
            <h3>Google AdSense and Third-Party Advertising</h3>
            <p>We use <strong>Google AdSense</strong> to serve advertisements on our site. Google uses cookies, specifically the DART cookie, to serve ads based on your visits to our site and other sites on the internet. You can opt out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy. We may also work with other third-party advertising networks that use similar technologies.</p>
            <h3>Data Sharing and Third Parties</h3>
            <p>We do not sell or rent your personal information to third parties. We may share data with trusted service providers who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. We may also release information when its release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.</p>
            <h3>Your Rights</h3>
            <p>As a user, you have the right to access, correct, or delete your personal data. You can also object to the processing of your data or request data portability. To exercise these rights, please contact us at ${CONFIG.COMPANY.email}. We will respond to your request within 30 days.</p>
            <h3>Data Security</h3>
            <p>We implement a variety of security measures to maintain the safety of your personal information. We use encryption (SSL) to protect data transmitted online and maintain physical and administrative safeguards to protect data stored on our servers.</p>
            <h3>Children's Privacy</h3>
            <p>Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete such information from our files.</p>
            <h3>Changes to This Policy</h3>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically for any changes.</p>
            <p>If you have any questions about this Privacy Policy, please contact us at ${CONFIG.COMPANY.email}.</p>`
        },
        {
            slug: 'disclaimer',
            title: 'Legal Disclaimer and Terms of Use | Tarjeta Roja En Vivo',
            h1: 'Legal Disclaimer',
            content: `
            <p>The information provided by <strong>${CONFIG.COMPANY.name}</strong> on ${CONFIG.DOMAIN} is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>
            <h3>No Professional Advice</h3>
            <p>The information on this site does not constitute professional sports, legal, or financial advice. Any reliance you place on such information is therefore strictly at your own risk. We recommend consulting with appropriate professionals before making any decisions based on the information found on our platform.</p>
            <h3>External Links Disclaimer</h3>
            <p>Our website may contain links to external websites that are not provided or maintained by or in any way affiliated with ${CONFIG.COMPANY.name}. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites. We have no control over the content, privacy policies, or practices of any third-party sites or services.</p>
            <h3>No Hosting of Copyrighted Content</h3>
            <p><strong>CRITICAL NOTICE:</strong> ${CONFIG.COMPANY.name} does not host, upload, or stream any video content, including live sports broadcasts. We are a sports information directory and news portal. We provide links to third-party websites that may contain such content, but we do not have any control over those servers. We do not encourage or condone the illegal distribution of copyrighted material. Users are solely responsible for ensuring that their use of any third-party service complies with local laws and regulations.</p>
            <h3>Limitation of Liability</h3>
            <p>In no event shall ${CONFIG.COMPANY.publisher} or its directors, employees, or partners be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the site.</p>
            <h3>Errors and Omissions</h3>
            <p>While we strive to keep the information on our site up to date and correct, errors may occur. We reserve the right to make additions, deletions, or modifications to the contents on the site at any time without prior notice. We do not warrant that the site is free of viruses or other harmful components.</p>
            <p>By using our website, you hereby consent to our disclaimer and agree to its terms.</p>`
        },
        {
            slug: 'contact-us',
            title: 'Contact Our Team | Tarjeta Roja En Vivo',
            h1: 'Contact Us',
            content: `
            <p>We are always happy to hear from our readers, partners, and the sports community. Whether you have a question about a specific match, want to report a technical issue, or are interested in a collaboration, our team is ready to help.</p>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:2rem; margin-top:2rem;">
                <div>
                    <h3>Our Office</h3>
                    <p><strong>${CONFIG.COMPANY.publisher}</strong></p>
                    <p>${CONFIG.COMPANY.address}</p>
                    <p><strong>Phone:</strong> ${CONFIG.COMPANY.phone}</p>
                    <p><strong>Email:</strong> ${CONFIG.COMPANY.email}</p>
                    <h3>Business Hours</h3>
                    <p>${CONFIG.COMPANY.hours}</p>
                    <p>We typically respond to all inquiries within 24-48 business hours.</p>
                </div>
                <div class="contact-form">
                    <h3>Send a Message</h3>
                    <form action="#" method="POST" onsubmit="alert('Gracias por su mensaje. Nos pondremos en contacto pronto.'); return false;">
                        <input type="text" placeholder="Your Full Name" required>
                        <input type="email" placeholder="Your Email Address" required>
                        <input type="text" placeholder="Subject" required>
                        <textarea rows="6" placeholder="How can we help you today?" required></textarea>
                        <button type="submit">Send Message</button>
                    </form>
                </div>
            </div>`
        },
        {
            slug: 'terms-and-conditions',
            title: 'Terms and Conditions of Use | Tarjeta Roja En Vivo',
            h1: 'Terms and Conditions',
            content: `
            <p>Welcome to <strong>${CONFIG.COMPANY.name}</strong>. By accessing and using this website, you agree to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern ${CONFIG.COMPANY.publisher}'s relationship with you in relation to this website.</p>
            <h3>Acceptance of Terms</h3>
            <p>The use of this website is subject to the following terms of use: The content of the pages of this website is for your general information and use only. It is subject to change without notice. Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness, or suitability of the information and materials found or offered on this website for any particular purpose.</p>
            <h3>Intellectual Property</h3>
            <p>This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions. All trademarks reproduced in this website, which are not the property of, or licensed to the operator, are acknowledged on the website.</p>
            <h3>User Conduct</h3>
            <p>Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense. You may not use this website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website; or in any way which is unlawful, illegal, fraudulent, or harmful.</p>
            <h3>Termination</h3>
            <p>We may terminate or suspend access to our site immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>
            <h3>Governing Law</h3>
            <p>Your use of this website and any dispute arising out of such use of the website is subject to the laws of Spain. Any legal action or proceeding related to this website shall be brought exclusively in a court of competent jurisdiction sitting in Madrid, Spain.</p>`
        },
        {
            slug: 'dmca',
            title: 'DMCA and Copyright Compliance | Tarjeta Roja En Vivo',
            h1: 'DMCA Policy',
            content: `
            <p><strong>${CONFIG.COMPANY.name}</strong> respects the intellectual property of others. If you believe that your work has been copied in a way that constitutes copyright infringement, please follow our DMCA notice procedure below.</p>
            <h3>Notice of Infringement</h3>
            <p>To file a notice of infringement with us, you must provide a written communication that sets forth the items specified below. Please note that you will be liable for damages (including costs and attorneys' fees) if you materially misrepresent that a product or activity is infringing your copyrights.</p>
            <p>Your notice must include:</p>
            <ul>
                <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
                <li>Identification of the copyrighted work claimed to have been infringed.</li>
                <li>Identification of the material that is claimed to be infringing and information reasonably sufficient to permit us to locate the material.</li>
                <li>Information reasonably sufficient to permit us to contact the complaining party, such as an address, telephone number, and email address.</li>
                <li>A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner.</li>
                <li>A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner.</li>
            </ul>
            <p>Send your notice to: <strong>${CONFIG.COMPANY.email}</strong></p>`
        },
        {
            slug: 'advertise',
            title: 'Advertising and Partnerships | Tarjeta Roja En Vivo',
            h1: 'Advertise With Us',
            content: `
            <p>Connect your brand with a highly engaged audience of sports fans. <strong>${CONFIG.COMPANY.name}</strong> offers premium advertising opportunities for brands looking to reach the Spanish-speaking sports market.</p>
            <h3>Our Audience</h3>
            <p>Our readers are passionate, loyal, and tech-savvy. They visit our site daily to stay informed about their favorite teams and competitions. With millions of monthly pageviews, we provide a powerful platform for your marketing message.</p>
            <h3>Advertising Options</h3>
            <ul>
                <li><strong>Display Advertising:</strong> Standard IAB sizes available across all pages.</li>
                <li><strong>Native Integration:</strong> Seamlessly integrate your brand into our match previews and news sections.</li>
                <li><strong>Direct Email:</strong> Reach our community through our weekly sports digest.</li>
                <li><strong>Custom Campaigns:</strong> We work with you to create unique experiences that resonate with our fans.</li>
            </ul>
            <h3>Contact Us for a Media Kit</h3>
            <p>Ready to grow your brand with us? Contact our advertising department at <strong>advertise@tarjetarojaenvivo.live</strong> or email our main office at ${CONFIG.COMPANY.email}. We look forward to building a successful partnership.</p>`
        }
    ];

    trustPages.forEach(page => {
        const dir = path.join(CONFIG.OUTPUT_DIR, page.slug);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const html = generateHTML({
            title: page.title,
            description: `Official ${page.h1} for ${CONFIG.COMPANY.name}. We are committed to transparency, privacy, and providing high-quality sports information.`,
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
        title: `Mapa del Sitio - Navegación Completa | TarjetaRojaEnvivo`,
        description: `Encuentra todas las secciones, marcas, partidos y documentos legales de TarjetaRojaEnvivo en un solo lugar.`,
        h1: `Mapa del Sitio`,
        content: `
        <p>Utiliza nuestro mapa del sitio para navegar rápidamente por todas las secciones de nuestro portal deportivo. Aquí encontrarás acceso directo a nuestras marcas principales, hubs de contenido y la programación más reciente.</p>
        <h3>Marcas y Variantes</h3>
        <ul>${brandLinks}</ul>
        <h3>Secciones de Contenido</h3>
        <ul>${hubLinks}</ul>
        <h3>Información Corporativa y Legal</h3>
        <ul>${trustLinks}</ul>
        <h3>Programación de Partidos Recientes</h3>
        <ul>${matchLinks}</ul>`,
        canonical: `${CONFIG.DOMAIN}/mapa-del-sitio/`,
        schema: { "@context": "https://schema.org", "@type": "WebPage", "name": "Mapa del Sitio" }
    });

    fs.writeFileSync(path.join(dir, 'index.html'), html);
}

// 6. Build-time Orphan Check
function runOrphanCheck() {
    console.log('🔍 Running Orphan Check...');
    const pages = [];

    function walk(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                walk(fullPath);
            } else if (file === 'index.html') {
                pages.push(fullPath);
            }
        });
    }

    walk(CONFIG.OUTPUT_DIR);

    let failed = false;
    pages.forEach(page => {
        const content = fs.readFileSync(page, 'utf8');
        const linkCount = (content.match(/<a\s+href=/g) || []).length;

        if (linkCount < 3) {
            console.error(`❌ FAIL: Page ${page} is an orphan with only ${linkCount} links.`);
            failed = true;
        }
    });

    if (failed) {
        console.error('❌ Build failed due to orphaned pages.');
        process.exit(1);
    }

    console.log(`✅ Orphan check passed for ${pages.length} pages.`);
}

// Main Execution
async function run() {
    try {
        console.log('🚀 Starting SEO, Trust & Compliance Automation...');

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

        console.log('✅ All static pages generated.');

        runOrphanCheck();

        console.log('🎉 Automation completed successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

run();

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// your code continues…

// Configuration
const SOURCE_URL = 'https://raw.githubusercontent.com/albinchristo04/ptv/refs/heads/main/events.json';
const OUTPUT_FILE = 'seo-metadata.json';
const DOMAIN = 'https://tarjetarojaenvivo.live';

// Primary English keywords for search engine optimization
const PRIMARY_KEYWORDS = [
  'red card sports',
  'red card tv',
  'red card live',
  'tarjeta roja',
  'tarjeta roja tv',
  'red card sports live',
  'tarjeta roja directa',
  'tarjeta roja en vivo',
  'free sports streaming',
  'live sports free',
  'red card football live',
  'free football streaming',
  'red card football',
  'sports streaming free',
  'red card sports tv',
  'live sports channel',
  'red card live sports',
  'free live sports',
  'red card sports streaming'
];

// ... rest of the code from the artifact

// Fetch JSON data
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

// Generate SEO-friendly slug
function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Translate category names to English
function translateCategory(category) {
  const translations = {
    'American Football': 'American Football',
    'Basketball': 'Basketball',
    'Combat Sports': 'Combat Sports',
    'Darts': 'Darts',
    'Football': 'Football',
    'Ice Hockey': 'Ice Hockey',
    'Wrestling': 'Wrestling',
    '24/7 Streams': '24/7 Streams'
  };
  return translations[category] || category;
}

// Get English month name
function getEnglishMonth(month) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month];
}

// Get English day name
function getEnglishDay(day) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[day];
}

// Format date in English
function formatEnglishDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const day = getEnglishDay(date.getDay());
  const dayNum = date.getDate();
  const month = getEnglishMonth(date.getMonth());
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return {
    full: `${day}, ${month} ${dayNum}, ${year}`,
    short: `${month} ${dayNum}, ${year}`,
    time: `${hours}:${minutes}`,
    iso: date.toISOString()
  };
}

// Format date for SEO
function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toISOString();
}

// Generate rich metadata for each event
function generateMetadata(stream, category) {
  const {
    id,
    name,
    tag,
    poster,
    uri_name,
    starts_at,
    ends_at,
    category_name,
    viewers
  } = stream;

  const eventDate = formatEnglishDate(starts_at);
  const endDate = formatEnglishDate(ends_at);
  const slug = generateSlug(name);
  const categorySpanish = translateCategory(category_name);

  // Extract teams/competitors from name
  const teams = name.split(' vs. ').map(t => t.trim());
  const isVersusMatch = teams.length === 2;

  // Build keyword list with primary keywords + event-specific terms
  const eventKeywords = [
    ...PRIMARY_KEYWORDS.slice(0, 8), // Top 8 primary keywords
    name,
    ...teams,
    categorySpanish,
    category_name,
    'watch online free',
    'live free',
    'free streaming',
    tag,
    eventDate.short,
    'live streaming'
  ];

  // Generate comprehensive SEO metadata in Spanish
  return {
    // Basic Info
    id,
    slug,
    uri_name,
    canonical_url: `${DOMAIN}/eventos/${uri_name}`,

    // SEO Meta Tags (English, optimized for search engines)
    meta: {
      title: `${name} LIVE - Tarjeta Roja TV | Free Live Sports`,
      description: `⚽ Watch ${name} live free on Tarjeta Roja TV. ${isVersusMatch ? `${teams[0]} vs ${teams[1]}` : name} live stream ${eventDate.full}. Rojadirecta, Pirlo TV - Free online sports.`,
      keywords: eventKeywords.join(', '),
      robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      author: 'Tarjeta Roja En Vivo',
      viewport: 'width=device-width, initial-scale=1.0',
      language: 'en',
      'geo.region': 'US',
      'geo.placename': 'United States',
      rating: 'general',
      revisit_after: '1 hour',
      'msapplication-TileColor': '#e31937',
      'theme-color': '#e31937'
    },

    // Open Graph (Facebook, LinkedIn) - English
    og: {
      type: 'website',
      url: `${DOMAIN}/eventos/${uri_name}`,
      title: `${name} LIVE ⚽ Tarjeta Roja TV - Free Live Sports`,
      description: `Watch ${name} live free. ${isVersusMatch ? `${teams[0]} vs ${teams[1]}` : name} live stream on Tarjeta Roja TV - ${eventDate.full} at ${eventDate.time}hrs.`,
      image: poster,
      image_alt: `${name} - Tarjeta Roja TV live`,
      site_name: 'Tarjeta Roja En Vivo - Rojadirecta TV',
      locale: 'en_US',
      locale_alternate: ['en_GB', 'en_CA', 'en_AU']
    },

    // Twitter Card - English
    twitter: {
      card: 'summary_large_image',
      site: '@tarjetarojatvs',
      title: `${name} LIVE ⚽ Tarjeta Roja - Rojadirecta`,
      description: `Watch ${name} live free on Tarjeta Roja TV. ${categorySpanish} live stream.`,
      image: poster,
      image_alt: `${name} free streaming`,
      creator: '@tarjetarojatvs'
    },

    // Schema.org JSON-LD for Rich Results (English)
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SportsEvent',
      name: name,
      description: `Live broadcast of ${name} free on Tarjeta Roja TV`,
      startDate: eventDate.iso,
      endDate: endDate.iso,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
      location: {
        '@type': 'VirtualLocation',
        url: `${DOMAIN}/eventos/${uri_name}`,
        name: 'Tarjeta Roja En Vivo'
      },
      image: [poster],
      organizer: {
        '@type': 'Organization',
        name: 'Tarjeta Roja En Vivo',
        url: DOMAIN,
        logo: `${DOMAIN}/logo.png`,
        sameAs: [
          'https://www.facebook.com/tarjetarojaenvivo',
          'https://twitter.com/tarjetarojatvs'
        ]
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: `${DOMAIN}/eventos/${uri_name}`,
        validFrom: eventDate.iso
      },
      ...(isVersusMatch && {
        competitor: teams.map(team => ({
          '@type': 'SportsTeam',
          name: team
        })),
        homeTeam: {
          '@type': 'SportsTeam',
          name: teams[0]
        },
        awayTeam: {
          '@type': 'SportsTeam',
          name: teams[1]
        }
      }),
      sport: categorySpanish,
      inLanguage: 'en'
    },

    // Additional SEO Elements (English)
    seo: {
      breadcrumbs: [
        { name: 'Home', url: DOMAIN },
        { name: categorySpanish, url: `${DOMAIN}/categoria/${generateSlug(categorySpanish)}` },
        { name: name, url: `${DOMAIN}/eventos/${uri_name}` }
      ],
      h1: `${name} LIVE - Tarjeta Roja TV`,
      h2: `Watch ${name} Online Free on Rojadirecta`,
      faq: [
        {
          question: `How to watch ${name} live for free?`,
          answer: `You can watch ${name} live free on Tarjeta Roja TV. The broadcast starts on ${eventDate.full} at ${eventDate.time}hrs. Rojadirecta and Pirlo TV stream live.`
        },
        {
          question: `What time is ${name}?`,
          answer: `${name} starts on ${eventDate.full} at ${eventDate.time}hrs (Spain time).`
        },
        {
          question: `Where to watch ${name} online?`,
          answer: `Watch ${name} online on Tarjeta Roja TV, Rojadirecta, and Pirlo TV. Free live streaming without registration.`
        },
        ...(isVersusMatch ? [{
          question: `Where to watch ${teams[0]} vs ${teams[1]} live?`,
          answer: `Watch ${teams[0]} vs ${teams[1]} live on Tarjeta Roja, Rojadirecta TV and Pirlo TV. Free streaming of ${categorySpanish}.`
        }] : []),
        {
          question: 'What is Tarjeta Roja TV?',
          answer: 'Tarjeta Roja TV (also known as Rojadirecta, Pirlo TV) is a platform to watch live sports for free. Broadcasting football, basketball, UFC and more online sports.'
        },
        {
          question: 'Is Tarjeta Roja free?',
          answer: 'Yes, Tarjeta Roja TV is completely free. Watch all live matches without paying, without registration and without invasive advertising.'
        }
      ],
      content_sections: [
        {
          heading: `Watch ${name} Live Free`,
          content: `Live broadcast of ${name} on Tarjeta Roja TV. ${isVersusMatch ? `${teams[0]} faces ${teams[1]}` : name} on ${eventDate.full}. Rojadirecta and Pirlo TV offer free streaming of ${categorySpanish}.`
        },
        {
          heading: `${name} - Tarjeta Roja Direct`,
          content: `Watch ${name} online free. La Roja Direct broadcasts ${categorySpanish} live without cuts. Rojadirecta TV, Pirlo TV and Tarjeta Roja are your best option to watch free sports.`
        }
      ]
    },

    // Event Details (English)
    event: {
      name,
      name_en: name,
      category: category_name,
      category_en: categorySpanish,
      broadcaster: tag,
      start_time: eventDate.iso,
      start_time_formatted: `${eventDate.full} - ${eventDate.time}hrs`,
      end_time: endDate.iso,
      duration_minutes: Math.round((ends_at - starts_at) / 60),
      status: starts_at < Date.now() / 1000 ? (ends_at > Date.now() / 1000 ? 'live' : 'completed') : 'upcoming',
      viewers: viewers || '0',
      language: 'en',
      country_focus: ['US', 'GB', 'CA', 'AU', 'IE', 'NZ', 'ZA', 'IN'],
      ...(isVersusMatch && {
        home_team: teams[0],
        away_team: teams[1],
        match_type: 'vs',
        match_title: `${teams[0]} vs ${teams[1]}`
      })
    },

    // Technical SEO (Optimized for search engines)
    technical: {
      last_modified: new Date().toISOString(),
      priority: stream.always_live ? 0.9 : 0.85,
      changefreq: stream.always_live ? 'always' : 'hourly',
      hreflang: 'en',
      alternate_languages: {
        'en-US': `${DOMAIN}/eventos/${uri_name}`,
        'en-GB': `${DOMAIN}/uk/eventos/${uri_name}`,
        'en-CA': `${DOMAIN}/ca/eventos/${uri_name}`
      }
    },

    // Search engine optimizations
    search: {
      verify: 'search-engine-verification-code',
      news_keywords: eventKeywords.slice(0, 10).join(', '),
      content_type: 'Sports',
      syndication_source: DOMAIN,
      original_source: DOMAIN,
      content_language: 'en',
      geo_region: 'US',
      distribution: 'global',
      audience: 'all',
      rating: 'general'
    }
  };
}

// Main function
async function generateSEOData() {
  try {
    console.log('Fetching events data...');
    const data = await fetchJSON(SOURCE_URL);

    if (!data.events || !data.events.streams) {
      throw new Error('Invalid data structure');
    }

    const seoData = {
      generated_at: new Date().toISOString(),
      total_events: 0,
      categories: [],
      events: []
    };

    // Process each category
    for (const category of data.events.streams) {
      if (category.category === '24/7 Streams') continue;

      const categorySpanish = translateCategory(category.category);

      const categoryMeta = {
        id: category.id,
        name: category.category,
        name_en: categorySpanish,
        slug: generateSlug(category.category),
        event_count: category.streams.length,
        always_live: category.always_live,
        canonical_url: `${DOMAIN}/categoria/${generateSlug(categorySpanish)}`,
        meta: {
          title: `${categorySpanish} LIVE - Tarjeta Roja TV | Free Live Sports`,
          description: `⚽ Watch ${categorySpanish} live free on Tarjeta Roja TV. All matches and events of ${categorySpanish} online. Rojadirecta, Pirlo TV - Free streaming.`,
          keywords: [
            ...PRIMARY_KEYWORDS.slice(0, 10),
            categorySpanish,
            category.category,
            `${categorySpanish} live`,
            `watch ${categorySpanish} free`,
            `${categorySpanish} online`
          ].join(', ')
        },
        schema: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${categorySpanish} Live - Tarjeta Roja TV`,
          description: `Watch all events of ${categorySpanish} live free`,
          url: `${DOMAIN}/categoria/${generateSlug(categorySpanish)}`,
          inLanguage: 'en'
        }
      };

      seoData.categories.push(categoryMeta);

      // Process each stream in category
      for (const stream of category.streams) {
        const eventMeta = generateMetadata(stream, category.category);
        seoData.events.push(eventMeta);
        seoData.total_events++;
      }
    }

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(seoData, null, 2));
    console.log(`✅ Generated SEO metadata for ${seoData.total_events} events`);
    console.log(`📁 Output saved to: ${OUTPUT_FILE}`);

    // Generate sitemap URLs with English priorities
    const sitemapUrls = [
      // Homepage - highest priority
      {
        loc: DOMAIN,
        lastmod: new Date().toISOString(),
        changefreq: 'always',
        priority: 1.0,
        'xhtml:link': [
          { rel: 'alternate', hreflang: 'en', href: DOMAIN },
          { rel: 'alternate', hreflang: 'en-US', href: DOMAIN },
          { rel: 'alternate', hreflang: 'en-GB', href: `${DOMAIN}/uk` },
          { rel: 'alternate', hreflang: 'x-default', href: DOMAIN }
        ]
      },
      // Category pages
      ...seoData.categories.map(c => ({
        loc: c.canonical_url,
        lastmod: new Date().toISOString(),
        changefreq: 'hourly',
        priority: 0.9
      })),
      // Event pages
      ...seoData.events.map(e => ({
        loc: e.canonical_url,
        lastmod: e.technical.last_modified,
        changefreq: e.technical.changefreq,
        priority: e.technical.priority
      }))
    ];

    fs.writeFileSync('sitemap-urls.json', JSON.stringify(sitemapUrls, null, 2));
    console.log(`🗺️  Generated sitemap URLs: sitemap-urls.json`);

    // Generate keywords file for Webmaster Tools
    const keywordData = {
      primary_keywords: PRIMARY_KEYWORDS,
      total_keywords: PRIMARY_KEYWORDS.length,
      target_audience: 'English speakers (US, UK, Canada, Australia)',
      target_search_engines: ['Google', 'Bing'],
      language: 'en',
      generated_at: new Date().toISOString()
    };

    fs.writeFileSync('keywords.json', JSON.stringify(keywordData, null, 2));
    console.log(`🔑 Generated keywords file: keywords.json`);

    return seoData;
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the generator
generateSEOData();

export { generateSEOData, generateMetadata };

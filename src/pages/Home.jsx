import { useEffect, useState } from 'react';
import { getEvents } from '../lib/api';
import { Loader2 } from 'lucide-react';
import { Title, Meta } from 'react-head';
import Hero from '../components/home/Hero';
import LiveCarousel from '../components/home/LiveCarousel';
import MatchGrid from '../components/home/MatchGrid';

export default function Home() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        getEvents().then(res => {
            setData(res);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!data?.events?.streams) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-xl font-bold mb-2">No se encontraron eventos</h2>
                <p className="text-gray-400">Por favor intenta más tarde.</p>
            </div>
        );
    }

    // Flatten and process events
    const categories = data.events.streams;
    let allMatches = [];
    categories.forEach(cat => {
        if (cat.streams && cat.category !== '24/7 Streams') {
            cat.streams.forEach(stream => {
                allMatches.push({ ...stream, category_name: cat.category });
            });
        }
    });

    const now = Date.now() / 1000;
    const isLive = (m) => (m.starts_at <= now && m.ends_at > now);

    const liveMatches = allMatches.filter(isLive);
    const upcomingMatches = allMatches.filter(m => m.starts_at > now);

    upcomingMatches.sort((a, b) => a.starts_at - b.starts_at);
    const heroMatch = liveMatches.length > 0 ? liveMatches[0] : upcomingMatches[0];

    let displayMatches = [...allMatches];

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        displayMatches = displayMatches.filter(m =>
            m.name.toLowerCase().includes(q) ||
            m.category_name.toLowerCase().includes(q) ||
            m.tag?.toLowerCase().includes(q)
        );
    }

    if (activeCategory !== 'All') {
        displayMatches = displayMatches.filter(m => m.category_name === activeCategory);
    }

    displayMatches.sort((a, b) => {
        const aLive = isLive(a);
        const bLive = isLive(b);
        if (aLive && !bLive) return -1;
        if (!aLive && bLive) return 1;
        return a.starts_at - b.starts_at;
    });

    const uniqueCategories = ['All', ...new Set(allMatches.map(m => m.category_name))];

    return (
        <div className="bg-background min-h-screen pb-20">
            <Title>Tarjeta Roja TV - Deportes en Vivo Gratis</Title>
            <Meta name="description" content="Ver fútbol, NBA, UFC, tenis y más deportes en vivo gratis. Tarjeta Roja TV ofrece streams de alta calidad." />

            {heroMatch && <Hero match={heroMatch} />}

            {liveMatches.length > 0 && (
                <section className="mt-8">
                    <div className="container mx-auto px-4 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-live animate-pulse" />
                        <h2 className="text-xl font-bold tracking-wide uppercase">EN VIVO AHORA</h2>
                    </div>
                    <LiveCarousel matches={liveMatches} />
                </section>
            )}

            <section className="container mx-auto px-4 mt-12" id="schedule">
                <h2 className="text-xl font-bold tracking-wide uppercase mb-6">Próximos Eventos</h2>

                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {uniqueCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeCategory === cat
                                    ? 'bg-white text-black'
                                    : 'bg-card text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                {cat === 'All' ? 'Todos' : cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Buscar equipos, competencias..."
                            className="w-full bg-card border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-white/30 placeholder:text-gray-600"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <MatchGrid matches={displayMatches.filter(m => !isLive(m) || activeCategory !== 'All')} />
            </section>
        </div>
    );
}

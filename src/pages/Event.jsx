import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEvents } from '../lib/api';
import { Loader2, ArrowLeft, Calendar, MonitorPlay } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Helmet } from 'react-helmet-async';
import MatchGrid from '../components/home/MatchGrid';

export default function Event() {
    const { id } = useParams();
    const [match, setMatch] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeStream, setActiveStream] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        getEvents().then(data => {
            let found = null;
            let allMatches = [];

            if (data?.events?.streams) {
                data.events.streams.forEach(cat => {
                    if (cat.streams) {
                        cat.streams.forEach(m => {
                            const mWithCat = { ...m, category_name: cat.category };
                            allMatches.push(mWithCat);
                            if (m.id == id || m.uri_name == id) {
                                found = mWithCat;
                            }
                        });
                    }
                });
            }

            setMatch(found);
            if (found) {
                setActiveStream(found.iframe);
                const rel = allMatches.filter(m => m.category_name === found.category_name && m.id !== found.id).slice(0, 4);
                setRelated(rel);
            }
            setLoading(false);
        });
    }, [id]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;
    if (!match) return <div className="h-screen flex items-center justify-center bg-background text-white">Evento no encontrado</div>;

    const date = new Date(match.starts_at * 1000);
    const isLive = (match.starts_at <= Date.now() / 1000 && match.ends_at > Date.now() / 1000);

    return (
        <div className="bg-background min-h-screen pb-20">
            <Helmet>
                <title>{`${match.name} En Vivo - Tarjeta Roja TV`}</title>
                <meta name="description" content={`Ver ${match.name} en vivo gratis online. Transmisión de ${match.category_name}.`} />
            </Helmet>

            {/* Player Section */}
            <div className="w-full bg-black aspect-video md:h-[85vh] relative group border-b border-white/10">
                {activeStream ? (
                    <iframe
                        src={activeStream}
                        className="w-full h-full border-0"
                        allowFullScreen
                        allow="autoplay; encrypted-media; picture-in-picture"
                        title={match.name}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        Selecciona una opción para ver
                    </div>
                )}

                <Link to="/" className="absolute top-6 left-6 z-20 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all border border-white/5 hover:border-white/20">
                    <ArrowLeft className="w-4 h-4" /> <span className="text-sm font-medium">Volver al Inicio</span>
                </Link>
            </div>

            <div className="container mx-auto px-4 mt-8">
                {/* Match Header */}
                <div className="flex flex-col lg:flex-row gap-8 lg:items-start justify-between border-b border-white/5 pb-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded text-xs text-secondary font-bold uppercase tracking-wider">{match.league || match.category_name}</span>
                            {isLive ? (
                                <span className="bg-live text-white px-3 py-1 rounded text-xs font-bold animate-pulse shadow-lg shadow-red-900/40">EN VIVO</span>
                            ) : (
                                <span className="bg-yellow-600/80 text-white px-3 py-1 rounded text-xs font-bold">PRÓXIMO</span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-4 text-white">{match.name}</h1>
                        <div className="flex items-center gap-4 text-gray-400 text-lg">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-gray-500" />
                                <span>{format(date, 'EEEE, d MMM', { locale: es })}</span>
                            </div>
                            <div className="w-1 h-1 bg-gray-600 rounded-full" />
                            <div className="text-white font-medium">{format(date, 'HH:mm')}</div>
                        </div>
                    </div>

                    {/* Alternative Streams */}
                    <div className="flex flex-col gap-3 min-w-[320px] bg-[#111] p-5 rounded-xl border border-white/5">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <MonitorPlay className="w-4 h-4" /> Opciones Disponibles
                        </h3>
                        <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                            <button
                                onClick={() => setActiveStream(match.iframe)}
                                className={`px-4 py-3 rounded-lg text-sm font-bold border transition-all flex justify-between items-center ${activeStream === match.iframe ? 'bg-white text-black border-white shadow-lg' : 'bg-card border-white/5 hover:bg-white/5 text-gray-300'}`}
                            >
                                <span>Opción Principal (HD)</span>
                                {activeStream === match.iframe && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                            </button>
                            {match.substreams?.map((sub, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveStream(sub.iframe)}
                                    className={`px-4 py-3 rounded-lg text-sm font-bold border transition-all flex justify-between items-center ${activeStream === sub.iframe ? 'bg-white text-black border-white shadow-lg' : 'bg-card border-white/5 hover:bg-white/5 text-gray-300'}`}
                                >
                                    <span>{sub.name || `Opción ${idx + 2}`}</span>
                                    {activeStream === sub.iframe && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Details & Recommended */}
                <div className="mt-16">
                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        <span className="w-1 h-8 bg-primary rounded-full" />
                        Partidos Recomendados
                    </h3>
                    {related.length > 0 ? (
                        <MatchGrid matches={related} />
                    ) : (
                        <p className="text-gray-500">No se encontraron partidos relacionados.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

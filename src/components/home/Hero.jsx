import { Link } from 'react-router-dom';
import { Play, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function Hero({ match }) {
    if (!match) return null;

    const bgImage = match.poster || '';
    const date = new Date(match.starts_at * 1000);
    // Encode ID safely if uri_name is not robust, but uri_name is better.
    const linkId = match.uri_name ? encodeURIComponent(match.uri_name) : match.id;

    return (
        <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden group">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                {/* Blur overlay for better text readability or aesthetic */}
                <div className="absolute inset-0 backdrop-blur-[2px] bg-black/20" />
            </div>

            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 pb-16 z-10">
                <div className="container mx-auto">
                    <div className="flex items-center gap-2 mb-4 animate-fade-in-up">
                        <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider uppercase bg-secondary text-white rounded-md shadow-[0_0_10px_rgba(0,123,255,0.5)]">
                            {match.category_name}
                        </span>
                        {match.tag && (
                            <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider uppercase border border-white/20 text-gray-300 rounded-md">
                                {match.tag}
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-black italic tracking-tighter mb-4 max-w-4xl leading-[0.9] text-white drop-shadow-2xl">
                        {match.name.replace(' vs. ', ' vs ')}
                    </h1>

                    <div className="flex items-center gap-6 mb-8 text-base md:text-lg font-medium text-gray-300">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span>{format(date, 'EEEE, MMM d')}</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                        <div className="text-white font-bold text-shadow-glow">
                            {format(date, 'h:mm a')}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            to={`/event/${match.id}`}
                            className="inline-flex items-center gap-3 bg-live hover:bg-red-600 text-white px-8 py-3.5 rounded-lg font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,45,45,0.4)] active:scale-95"
                        >
                            <Play className="fill-current w-5 h-5" />
                            WATCH LIVE
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

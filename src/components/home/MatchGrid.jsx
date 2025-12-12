import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, MonitorPlay } from 'lucide-react';

export default function MatchGrid({ matches }) {
    if (!matches || matches.length === 0) {
        return <div className="text-gray-500 py-10 text-center">No matches found in this category.</div>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
            {matches.map(match => {
                const date = new Date(match.starts_at * 1000);
                const isLive = (match.starts_at <= Date.now() / 1000 && match.ends_at > Date.now() / 1000);

                return (
                    <Link
                        key={match.id}
                        to={`/event/${match.id}`}
                        className="group relative bg-[#1A1A1A] rounded-xl overflow-hidden hover:bg-[#202020] transition-colors border border-white/5 hover:border-white/10 flex flex-col"
                    >
                        <div className="relative aspect-auto sm:aspect-video overflow-hidden">
                            <img
                                src={match.poster}
                                alt={match.name}
                                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isLive ? 'grayscale-0' : 'grayscale-[0.3] group-hover:grayscale-0'}`}
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-60" />

                            <div className="absolute top-2 right-2">
                                {isLive ? (
                                    <span className="bg-live text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">LIVE</span>
                                ) : (
                                    <span className="bg-black/60 backdrop-blur text-[10px] text-gray-300 font-bold px-2 py-0.5 rounded border border-white/10">{match.tag || 'HD'}</span>
                                )}
                            </div>
                        </div>

                        <div className="p-4 flex flex-col flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{match.category_name}</span>
                            </div>

                            <h3 className="text-sm font-bold text-white leading-snug mb-3 flex-1 group-hover:text-primary transition-colors">
                                {match.name}
                            </h3>

                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                                <span className={isLive ? 'text-live font-bold' : ''}>
                                    {isLive ? 'Streaming Now' : format(date, 'MMM d • h:mm a')}
                                </span>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}

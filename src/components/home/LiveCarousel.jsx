import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

export default function LiveCarousel({ matches }) {
    if (!matches || matches.length === 0) return null;

    return (
        <div className="scrollbar-hide w-full overflow-x-auto pb-4 cursor-grab active:cursor-grabbing">
            <div className="flex px-4 gap-4">
                {matches.map(match => (
                    <Link
                        key={match.id}
                        to={`/event/${match.id}`}
                        className="relative flex-none w-[80vw] sm:w-[300px] md:w-[350px] aspect-video rounded-xl overflow-hidden group bg-card ring-1 ring-white/10 hover:ring-live/50 transition-all hover:shadow-[0_0_20px_rgba(255,45,45,0.2)]"
                    >
                        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                        <img
                            src={match.poster}
                            alt={match.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 opacity-80 group-hover:opacity-60 transition-opacity" />

                        <div className="absolute top-3 left-3 flex items-center gap-2">
                            <span className="bg-live text-white text-xs font-black px-2 py-0.5 rounded shadow-lg animate-pulse">
                                EN VIVO
                            </span>
                            <div className="bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1.5">
                                <Eye className="w-3 h-3 text-red-500" />
                                <span>{match.viewers || '1.2k'}</span>
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-4">
                            <p className="text-xs text-primary font-bold tracking-wider mb-1 uppercase">{match.tag || match.category_name}</p>
                            <h3 className="text-white text-lg font-bold leading-tight line-clamp-2 drop-shadow-md">
                                {match.name}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

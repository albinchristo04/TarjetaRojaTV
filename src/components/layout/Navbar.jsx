import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur-sm support-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-2xl font-black italic tracking-tighter hover:opacity-90 transition-opacity">
                    TARJETA<span className="text-live">ROJA</span><span className="text-sm font-normal not-italic text-white/60 ml-1">ENVIVO</span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <Link to="/" className="text-sm font-semibold hover:text-primary transition-colors">Inicio</Link>
                    <a href="/futbol-en-vivo/" className="text-sm font-semibold hover:text-primary transition-colors">Fútbol En Vivo</a>
                    <a href="/partidos-de-hoy/" className="text-sm font-semibold hover:text-primary transition-colors">Partidos de Hoy</a>
                    <a href="/tarjeta-roja-tv/" className="text-sm font-semibold hover:text-primary transition-colors">Tarjeta Roja TV</a>
                    <a href="/contact-us/" className="text-sm font-semibold hover:text-primary transition-colors">Contacto</a>
                </div>
            </div>
        </nav>
    );
}

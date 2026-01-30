import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur-sm support-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-2xl font-black italic tracking-tighter hover:opacity-90 transition-opacity">
                    TARJETA<span className="text-live">ROJA</span><span className="text-sm font-normal not-italic text-white/60 ml-1">ENVIVO</span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <Link to="/" className="text-sm font-semibold hover:text-primary transition-colors">Inicio</Link>
                    <a href="/futbol-en-vivo/" className="text-sm font-semibold hover:text-primary transition-colors">Futbol En Vivo</a>
                    <a href="/partidos-de-hoy/" className="text-sm font-semibold hover:text-primary transition-colors">Partidos de Hoy</a>
                    <a href="/tarjeta-roja-tv/" className="text-sm font-semibold hover:text-primary transition-colors">Tarjeta Roja TV</a>
                    <a href="/contact-us/" className="text-sm font-semibold hover:text-primary transition-colors">Contacto</a>
                </div>

                <button
                    onClick={toggleMenu}
                    className="md:hidden p-2 text-white hover:text-primary transition-colors"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-background/98 border-t border-white/10">
                    <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                        <Link to="/" onClick={closeMenu} className="text-sm font-semibold hover:text-primary transition-colors py-2">Inicio</Link>
                        <a href="/futbol-en-vivo/" onClick={closeMenu} className="text-sm font-semibold hover:text-primary transition-colors py-2">Futbol En Vivo</a>
                        <a href="/partidos-de-hoy/" onClick={closeMenu} className="text-sm font-semibold hover:text-primary transition-colors py-2">Partidos de Hoy</a>
                        <a href="/tarjeta-roja-tv/" onClick={closeMenu} className="text-sm font-semibold hover:text-primary transition-colors py-2">Tarjeta Roja TV</a>
                        <a href="/contact-us/" onClick={closeMenu} className="text-sm font-semibold hover:text-primary transition-colors py-2">Contacto</a>
                        <div className="border-t border-white/10 pt-4 mt-2">
                            <a href="/about-us/" onClick={closeMenu} className="text-xs text-gray-400 hover:text-primary transition-colors block py-1">About Us</a>
                            <a href="/privacy-policy/" onClick={closeMenu} className="text-xs text-gray-400 hover:text-primary transition-colors block py-1">Privacy Policy</a>
                            <a href="/terms-and-conditions/" onClick={closeMenu} className="text-xs text-gray-400 hover:text-primary transition-colors block py-1">Terms & Conditions</a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

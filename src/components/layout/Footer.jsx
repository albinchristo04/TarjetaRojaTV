import { Link } from 'react-router-dom';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0a0a0a] border-t border-white/5 py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="text-2xl font-black italic tracking-tighter text-white block mb-4">
                            TARJETA<span className="text-[#e31937]">ROJA</span>ENVIVO
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                            Tarjeta Roja TV es tu guía definitiva para ver deportes en vivo gratis por internet.
                            Fútbol, Baloncesto, Tenis, F1 y mucho más. La mejor calidad y la mejor experiencia de usuario.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Legal</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/dmca" className="hover:text-primary transition-colors">DMCA / Copyright</Link></li>
                            <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
                            <li><Link to="/terms" className="hover:text-primary transition-colors">Términos de Uso</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Sitio</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/about" className="hover:text-primary transition-colors">Sobre Nosotros</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contacto</Link></li>
                            <li><Link to="/" className="hover:text-primary transition-colors">Inicio</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; {currentYear} Tarjeta Roja TV. Todos los derechos reservados.</p>
                    <p className="mt-2 md:mt-0">
                        Hecho con <span className="text-red-500">♥</span> para los fanáticos del deporte.
                    </p>
                </div>
            </div>
        </footer>
    );
}

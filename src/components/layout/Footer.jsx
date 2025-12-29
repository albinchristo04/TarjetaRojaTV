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
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Marcas</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="/tarjeta-roja/" className="hover:text-primary transition-colors">Tarjeta Roja</a></li>
                            <li><a href="/tarjeta-roja-tv/" className="hover:text-primary transition-colors">Tarjeta Roja TV</a></li>
                            <li><a href="/tarjeta-roja-en-vivo/" className="hover:text-primary transition-colors">Tarjeta Roja en Vivo</a></li>
                            <li><a href="/tarjetarojaenvivo/" className="hover:text-primary transition-colors">TarjetaRojaEnvivo</a></li>
                            <li><a href="/tarjeta-roja-directa/" className="hover:text-primary transition-colors">Tarjeta Roja Directa</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Explorar</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="/futbol-en-vivo/" className="hover:text-primary transition-colors">Fútbol en Vivo</a></li>
                            <li><a href="/partidos-de-hoy/" className="hover:text-primary transition-colors">Partidos de Hoy</a></li>
                            <li><a href="/futbol-gratis/" className="hover:text-primary transition-colors">Fútbol Gratis</a></li>
                            <li><a href="/canales-deportivos-en-vivo/" className="hover:text-primary transition-colors">Canales en Vivo</a></li>
                            <li><a href="/mapa-del-sitio/" className="hover:text-primary transition-colors">Mapa del Sitio</a></li>
                            <li><Link to="/dmca" className="hover:text-primary transition-colors">DMCA</Link></li>
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

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
                            Tarjeta Roja En Vivo es un portal de información deportiva operado por Tarjeta Roja Media Network.
                            Ofrecemos horarios, estadísticas y noticias del mundo del fútbol.
                        </p>
                        <div className="mt-4 text-xs text-gray-500">
                            <p>Calle de Alcalá 476, 28027 Madrid, Spain</p>
                            <p>Email: contact@tarjetarojaenvivo.live</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Legal</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="/about-us/" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="/contact-us/" className="hover:text-primary transition-colors">Contact Us</a></li>
                            <li><a href="/privacy-policy/" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="/terms-and-conditions/" className="hover:text-primary transition-colors">Terms & Conditions</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Soporte</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="/disclaimer/" className="hover:text-primary transition-colors">Disclaimer</a></li>
                            <li><a href="/dmca/" className="hover:text-primary transition-colors">DMCA</a></li>
                            <li><a href="/advertise/" className="hover:text-primary transition-colors">Advertise</a></li>
                            <li><a href="/mapa-del-sitio/" className="hover:text-primary transition-colors">Mapa del Sitio</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <div>
                        <p>&copy; {currentYear} Tarjeta Roja En Vivo. Todos los derechos reservados.</p>
                        <p className="mt-1 text-gray-600">This site does not host or stream copyrighted content.</p>
                    </div>
                    <p className="mt-2 md:mt-0">
                        Tarjeta Roja Media Network - Madrid, Spain
                    </p>
                </div>
            </div>
        </footer>
    );
}

import { Title, Meta } from 'react-head';
import { Mail, MapPin } from 'lucide-react';

export default function Contact() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl text-gray-300">
            <Title>Contacto - Tarjeta Roja TV</Title>
            <Meta name="description" content="Ponte en contacto con el equipo de Tarjeta Roja TV." />

            <h1 className="text-3xl font-bold text-white mb-6">Contacto</h1>

            <div className="bg-card p-8 rounded-xl border border-white/10">
                <p className="mb-6">
                    Si tienes alguna pregunta, sugerencia, o necesitas reportar un problema técnico, no dudes en ponerte en contacto con nosotros. Estamos aquí para ayudarte.
                </p>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/20 p-3 rounded-full text-primary">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Correo Electrónico</h3>
                            <p>
                                Para consultas generales, soporte o publicidad:
                                <br />
                                <a href="mailto:admin@tarjetarojaenvivo.live" className="text-secondary hover:underline font-medium">
                                    admin@tarjetarojaenvivo.live
                                </a>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-primary/20 p-3 rounded-full text-primary">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Dirección Postal</h3>
                            <p>
                                Harold H. Jones<br />
                                1270 Brookview Drive<br />
                                Galveston, TX 77550
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                    <h3 className="text-lg font-bold text-white mb-2">Formulario de Contacto</h3>
                    <p className="text-sm">Por el momento, por favor utiliza el correo electrónico proporcionado arriba para contactarnos directamente.</p>
                </div>
            </div>
        </div>
    );
}

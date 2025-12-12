import { Title, Meta } from 'react-head';

export default function About() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl text-gray-300">
            <Title>Sobre Nosotros - Tarjeta Roja TV</Title>
            <Meta name="description" content="Información sobre Tarjeta Roja TV, tu portal de deportes en vivo." />

            <h1 className="text-3xl font-bold text-white mb-6">Sobre Nosotros</h1>

            <div className="space-y-4">
                <p className="text-lg text-white">
                    Bienvenido a <strong>Tarjeta Roja TV</strong>, tu destino número uno para estar al tanto de todos los eventos deportivos en vivo.
                </p>

                <h2 className="text-xl font-bold text-white mt-6 mb-2">Nuestra Misión</h2>
                <p>
                    Nuestra misión es simplificar la forma en que los fanáticos del deporte encuentran transmisiones en vivo de sus eventos favoritos. Sabemos lo difícil que puede ser encontrar un enlace que funcione justo cuando empieza el partido, por lo que nos dedicamos a agregar y organizar la mejor información disponible en la web.
                </p>

                <h2 className="text-xl font-bold text-white mt-6 mb-2">¿Qué Hacemos?</h2>
                <p>
                    Tarjeta Roja TV funciona como una guía de programación deportiva y un motor de búsqueda. Rastreamos la web en busca de transmisiones públicas de eventos deportivos como fútbol, baloncesto, tenis, UFC, Fórmula 1 y más, y los organizamos en una interfaz fácil de usar.
                </p>

                <h2 className="text-xl font-bold text-white mt-6 mb-2">Compromiso con la Calidad</h2>
                <p>
                    Nos esforzamos por ofrecer una experiencia de usuario de primera clase. Nuestro sitio está diseñado para ser rápido, receptivo y fácil de navegar tanto en computadoras de escritorio como en dispositivos móviles. Actualizamos nuestros listados constantemente para asegurar que tengas la información más precisa posible.
                </p>

                <p className="mt-8">
                    Gracias por elegir Tarjeta Roja TV. ¡Esperamos que disfrutes del juego!
                </p>
            </div>
        </div>
    );
}

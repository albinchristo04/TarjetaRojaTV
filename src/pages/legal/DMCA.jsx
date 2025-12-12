import { Title, Meta } from 'react-head';

export default function DMCA() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl text-gray-300">
            <Title>DMCA / Copyright - Tarjeta Roja TV</Title>
            <Meta name="description" content="Política de DMCA y Copyright de Tarjeta Roja TV. Aviso de exención de responsabilidad." />

            <h1 className="text-3xl font-bold text-white mb-6">DMCA / Copyright</h1>

            <div className="space-y-4">
                <p className="border-l-4 border-red-600 pl-4 bg-white/5 p-4 italic">
                    Tarjeta Roja TV es un proveedor de servicios de Internet que ofrece una plataforma que solo muestra enlaces a contenidos audiovisuales ubicados en servidores de terceros y proveídos y/o transmitidos por terceros.
                </p>

                <h2 className="text-xl font-bold text-white mt-6 mb-2">Aviso de Exención de Responsabilidad</h2>
                <p>
                    Nadie puede responsabilizar a los propietarios o administradores de este sitio web, así como a cualquier proveedor de servicios de Internet utilizado por este sitio web, por el contenido que se muestra o se enlaza.
                </p>
                <p>
                    <strong>Tarjeta Roja TV NO aloja, crea, ni sube ningún contenido de video.</strong> Simplemente actuamos como un motor de búsqueda, indexando enlaces que ya están disponibles públicamente en Internet. Todo el contenido es copyright de sus respectivos propietarios.
                </p>

                <h2 className="text-xl font-bold text-white mt-6 mb-2">Infracción de Copyright</h2>
                <p>
                    Si usted es propietario de los derechos de autor o un agente de los mismos y cree que algún contenido en nuestro sitio web infringe sus derechos de autor, por favor contáctenos con la siguiente información:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Una firma física o electrónica de una persona autorizada para actuar en nombre del propietario de un derecho exclusivo que presuntamente se ha infringido.</li>
                    <li>Identificación de la obra protegida por derechos de autor que se alega ha sido infringida.</li>
                    <li>Identificación del material que se alega está infringiendo o que es objeto de la actividad infractora y que debe ser eliminado o cuyo acceso debe ser deshabilitado.</li>
                    <li>Información razonablemente suficiente para permitirnos contactar con la parte reclamante, como una dirección, número de teléfono y, si está disponible, una dirección de correo electrónico.</li>
                </ul>

                <h2 className="text-xl font-bold text-white mt-6 mb-2">Eliminación de Contenido</h2>
                <p>
                    Tomamos muy en serio las violaciones de copyright y responderemos enérgicamente para proteger los derechos de los propietarios legales de derechos de autor. Si somos notificados de contenido que infringe derechos de autor, eliminaremos el enlace o contenido en cuestión a la mayor brevedad posible.
                </p>

                <p className="mt-6">
                    Por favor envíe todas las notificaciones de DMCA a: <strong>admin@tarjetarojaenvivo.live</strong>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Tenga en cuenta que solo podemos eliminar enlaces de nuestro propio sitio web, no podemos eliminar contenido de servidores de terceros que no controlamos.
                </p>
            </div>
        </div>
    );
}

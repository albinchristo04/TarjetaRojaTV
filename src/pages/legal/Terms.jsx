import { Title, Meta } from 'react-head';

export default function Terms() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl text-gray-300">
            <Title>Términos y Condiciones - Tarjeta Roja TV</Title>
            <Meta name="description" content="Términos y condiciones de uso de Tarjeta Roja TV." />

            <h1 className="text-3xl font-bold text-white mb-6">Términos y Condiciones</h1>

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white mt-6 mb-2">1. Aceptación de los Términos</h2>
                <p>
                    Al acceder al sitio web en https://tarjetarojaenvivo.live, usted acepta estar vinculado por estos términos de servicio, todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables. Si no está de acuerdo con alguno de estos términos, tiene prohibido usar o acceder a este sitio.
                </p>

                <h2 className="text-xl font-bold text-white mt-6 mb-2">2. Licencia de Uso</h2>
                <p>
                    El material en este sitio web es solo para información general. Se concede permiso para descargar temporalmente una copia de los materiales (información o software) en el sitio web de Tarjeta Roja TV solo para visualización transitoria personal y no comercial. Esta es la concesión de una licencia, no una transferencia de título, y bajo esta licencia usted no puede:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>modificar o copiar los materiales;</li>
                    <li>utilizar los materiales para cualquier propósito comercial, o para cualquier exhibición pública (comercial o no comercial);</li>
                    <li>intentar descompilar o aplicar ingeniería inversa a cualquier software contenido en el sitio web de Tarjeta Roja TV;</li>
                    <li>eliminar cualquier copyright u otras notaciones de propiedad de los materiales; o</li>
                    <li>transferir los materiales a otra persona o "espejar" los materiales en cualquier otro servidor.</li>
                </ul>

                <h2 className="text-xl font-bold text-white mt-6 mb-2">3. Descargo de Responsabilidad</h2>
                <p>
                    Los materiales en el sitio web de Tarjeta Roja TV se proporcionan "tal cual". Tarjeta Roja TV no ofrece garantías, expresas o implícitas, y por la presente renuncia y niega todas las otras garantías, incluyendo, sin limitación, garantías implícitas o condiciones de comerciabilidad, idoneidad para un propósito particular, o no infracción de propiedad intelectual u otra violación de derechos.
                </p>
                <p>
                    Tarjeta Roja TV funciona como un motor de búsqueda de streams que ya están alojados en sitios de terceros. No alojamos, subimos ni controlamos ningún contenido de video. Todo el contenido es propiedad de sus respectivos dueños.
                </p>

                <h2 className="text-xl font-bold text-white mt-6 mb-2">4. Limitaciones</h2>
                <p>
                    En ningún caso Tarjeta Roja TV o sus proveedores serán responsables de ningún daño (incluyendo, sin limitación, daños por pérdida de datos o beneficios, o debido a la interrupción del negocio) que surjan del uso o la imposibilidad de usar los materiales en el sitio web de Tarjeta Roja TV.
                </p>

                <h2 className="text-xl font-bold text-white mt-6 mb-2">5. Enlaces Externos</h2>
                <p>
                    Tarjeta Roja TV no ha revisado todos los sitios vinculados a su sitio web y no es responsable de los contenidos de dicho sitio vinculado. La inclusión de cualquier enlace no implica el respaldo por parte de Tarjeta Roja TV del sitio. El uso de cualquier sitio web vinculado es bajo el propio riesgo del usuario.
                </p>

                <h2 className="text-xl font-bold text-white mt-6 mb-2">6. Modificaciones</h2>
                <p>
                    Tarjeta Roja TV puede revisar estos términos de servicio para su sitio web en cualquier momento sin previo aviso. Al utilizar este sitio web, usted acepta estar vinculado por la versión actual de estos términos de servicio.
                </p>

                <h2 className="text-xl font-bold text-white mt-6 mb-2">7. Ley Aplicable</h2>
                <p>
                    Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes globales y usted se somete irrevocablemente a la jurisdicción exclusiva de los tribunales en esa ubicación.
                </p>
            </div>
        </div>
    );
}

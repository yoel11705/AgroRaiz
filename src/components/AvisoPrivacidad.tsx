import React from 'react';

const AvisoPrivacidad = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto text-justify text-gray-700">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">Aviso de Privacidad</h1>

      <p>
        <strong>[Nombre del Negocio]</strong>, con domicilio en <strong>[Dirección completa]</strong>, es el responsable del uso y protección de sus datos personales, y al respecto le informamos lo siguiente:
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-green-600">¿Para qué fines utilizaremos sus datos personales?</h2>
      <p>
        [Aquí puedes agregar las finalidades específicas del uso de datos, por ejemplo: para agendar citas, enviar recordatorios, brindar atención personalizada, etc.]
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-green-600">¿Qué datos personales utilizaremos para estos fines?</h2>
      <p>
        Para llevar a cabo las finalidades descritas en el presente aviso de privacidad, utilizaremos los siguientes datos personales:
      </p>
      <ul className="list-disc pl-6 mt-2">
        <li>Nombre completo</li>
        <li>Correo electrónico</li>
        <li>Teléfono</li>
        <li>Nombre de la finca (si aplica)</li>
        {/* Agrega más si es necesario */}
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-green-600">¿Cómo puede acceder, rectificar o cancelar sus datos personales, u oponerse a su uso?</h2>
      <p>
        Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la:
      </p>
      <ul className="list-disc pl-6 mt-2">
        <li><strong>Rectificación:</strong> corregir su información si está desactualizada, incompleta o incorrecta.</li>
        <li><strong>Cancelación:</strong> eliminarla de nuestros registros o bases de datos.</li>
        <li><strong>Oposición:</strong> oponerse al uso de sus datos para fines específicos.</li>
      </ul>
      <p className="mt-2">
        Estos derechos se conocen como derechos ARCO. Para ejercerlos, usted deberá presentar la solicitud respectiva a través del siguiente medio:
      </p>
      <p className="italic mt-1">
        [Agregar medio de contacto: correo, formulario web, teléfono, etc.]
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-green-600">Contacto del responsable de datos personales</h2>
      <p>
        Los datos de contacto de la persona o departamento de datos personales que está a cargo de dar trámite a las solicitudes ARCO son los siguientes:
      </p>
      <p className="italic mt-1">
        Nombre: [Nombre del responsable]<br />
        Correo electrónico: [correo@ejemplo.com]<br />
        Teléfono: [número de contacto]
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-green-600">Revocación del consentimiento</h2>
      <p>
        Usted puede revocar el consentimiento que nos haya otorgado para el tratamiento de sus datos personales. No obstante, es posible que no podamos atender su solicitud o concluir el uso de inmediato por alguna obligación legal.
      </p>
      <p className="mt-2">
        Para revocar su consentimiento deberá presentar su solicitud a través del siguiente medio:
      </p>
      <p className="italic">
        [Correo o formulario donde se hace la solicitud]
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-green-600">Limitación del uso o divulgación de su información</h2>
      <p>
        Con objeto de que usted pueda limitar el uso y divulgación de su información personal, le ofrecemos los siguientes medios:
      </p>
      <p className="italic">
        [Ejemplo: Registro en listado de exclusión, contacto por correo, etc.]
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-green-600">Cambios en este aviso de privacidad</h2>
      <p>
        Este aviso de privacidad puede sufrir modificaciones por cambios legales, necesidades internas o nuevas prácticas de privacidad.
      </p>
      <p className="mt-2">
        Nos comprometemos a mantenerlo informado sobre cualquier cambio a través de: <br />
        [Ejemplo: nuestro sitio web, correo electrónico, redes sociales, etc.]
      </p>

      <p className="mt-6 text-sm text-gray-500">Última actualización: 06/08/2025</p>
    </div>
  );
};

export default AvisoPrivacidad;

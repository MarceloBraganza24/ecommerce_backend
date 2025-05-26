import { sendEmail } from '../services/mail.service.js';
import { getConfig } from '../services/settings.service.js';

const emailFromUserToAdmin = async (req, res) => {
    try {
        const { first_name, last_name, email, message } = req.body;

        const settings = await getConfig();

        const adminEmails = settings.contactEmail
            .filter(contact => contact.selected)
            .map(contact => contact.email);

        if (!adminEmails.length) {
            return res.status(500).json({ mensaje: 'No hay correos de contacto habilitados para recibir mensajes.' });
        }

        // Enviar correo al administrador/es
        await sendEmail({
            to: adminEmails.join(','),
            subject: `Consulta de contacto - ${first_name} ${last_name}`,
            html: `
                <h2>Nuevo mensaje desde el formulario de contacto</h2>
                <p><strong>Nombre:</strong> ${first_name} ${last_name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mensaje:</strong><br>${message}</p>
            `
        });

        // Enviar autorespuesta al usuario, incluyendo el mensaje que escribió
        await sendEmail({
            to: email,
            subject: `Hemos recibido tu consulta - ${settings.storeName}`,
            html: `
                <p>Hola ${first_name},</p>
                <p>Gracias por contactarte con <strong>${settings.storeName}</strong>. Hemos recibido tu mensaje y te responderemos lo antes posible.</p>
                <hr>
                <p><strong>Tu mensaje:</strong></p>
                <blockquote style="border-left: 3px solid #ccc; padding-left: 10px; color: #555;">${message}</blockquote>
                <hr>
                <p>Saludos cordiales,<br>El equipo de ${settings.storeName}</p>
            `
        });

        res.status(200).json({ mensaje: 'Mensaje enviado correctamente.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al enviar el mensaje.' });
    }
};

export {
    emailFromUserToAdmin,
}
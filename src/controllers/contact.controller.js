import {sendEmail} from '../services/mail.service.js';

const emailFromUserToAdmin = async (req, res) => {
    const { first_name, last_name, email, message } = req.body; 
    console.log(req.body)
    /* if (!first_name || !last_name || !email || !message) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    try {
        const mailData = {
            to: 'admin@tucorreo.com', // ← Cambiar por el correo real del admin
            subject: 'Nueva consulta desde el formulario de contacto',
            html: `
                <h3>Consulta de ${first_name} ${last_name}</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${message}</p>
            `
        };
        await sendEmail(mailData);
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    } */
}

export {
    emailFromUserToAdmin,
}
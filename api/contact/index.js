const { EmailClient } = require("@azure/communication-email");

module.exports = async function (context, req) {
    // Habilitar CORS
    context.res = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    };

    // Manejar preflight OPTIONS
    if (req.method === "OPTIONS") {
        context.res.status = 200;
        return;
    }

    try {
        // Validar datos del formulario
        const { name, email, phone, message, subject } = req.body;
        
        if (!name || !email || !message) {
            context.res = {
                ...context.res,
                status: 400,
                body: { error: "Faltan campos requeridos" }
            };
            return;
        }

        // Configurar cliente de email
        const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING;
        const emailClient = new EmailClient(connectionString);
        
        // Crear mensaje de email
        const emailMessage = {
            senderAddress: "noreply@acs-domain.com", // Usar dominio de ACS
            content: {
                subject: `Nuevo contacto desde Nubelombia.com - ${subject || 'Consulta General'}`,
                html: `
                    <h2>Nuevo mensaje de contacto desde Nubelombia.com</h2>
                    <div style="font-family: Arial, sans-serif; max-width: 600px;">
                        <p><strong>Nombre:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
                        <p><strong>Asunto:</strong> ${subject || 'No especificado'}</p>
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
                            <p><strong>Mensaje:</strong></p>
                            <p>${message.replace(/\n/g, '<br>')}</p>
                        </div>
                        <hr style="margin-top: 30px;">
                        <p style="color: #666; font-size: 12px;">
                            Este mensaje fue enviado desde el formulario de contacto de nubelombia.com
                        </p>
                    </div>
                `
            },
            recipients: {
                to: [
                    { address: "lucia@nubelombia.com" },
                    { address: "contacto@nubelombia.com" } // Email adicional si es necesario
                ]
            }
        };

        // Enviar email
        context.log('Enviando email...');
        const poller = await emailClient.beginSend(emailMessage);
        await poller.pollUntilDone();
        
        context.res = {
            ...context.res,
            status: 200,
            body: { 
                message: "Mensaje enviado exitosamente",
                success: true 
            }
        };

    } catch (error) {
        context.log.error('Error enviando email:', error);
        
        context.res = {
            ...context.res,
            status: 500,
            body: { 
                error: "Error interno del servidor",
                success: false 
            }
        };
    }
};

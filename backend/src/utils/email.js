import nodemailer from 'nodemailer'
import 'dotenv/config.js'

export const transporter = nodemailer.createTransport({ //Genero la forma de enviar info desde mail (o sea, desde Gmail con x cuenta)
    host: 'smtp.gmail.com', //Defino que voy a utilizar un servicio de Gmail
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_SENDER, //Mail del que se envia informacion
        pass: process.env.MAIL_PASSWORD, // Contraseña de "Contraseña de apliaciones" en Gmail
        authMethod: 'LOGIN'
    }
})


export const sendEmail = async (req, res) => {
    try {
        await transporter.sendMail({
            from: 'Test Coder santicravero2@gmail.com',
            to: req.session.user.email,
            subject: "Probando nodemailer",
            html: `
                <div>
                    <h2>Aqui va el modelo de ticket mostrado en clase</h2>
                </div>
            `,
            attachments: []
        })
        res.status(200).send({ 
            message: "Email enviado" 
        })
    } catch(error) {
        res.status(400).send({
            message: "Error con el remitente",
            error: error
        })
    }
}
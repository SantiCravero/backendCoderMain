import nodemailer from "nodemailer";
import "dotenv/config.js";
export const transporter = nodemailer.createTransport({
  //Genero la forma de enviar info desde mail (o sea, desde Gmail con x cuenta)
  host: "smtp.gmail.com", //Defino que voy a utilizar un servicio de Gmail
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_SENDER, //Mail del que se envia informacion
    pass: process.env.MAIL_PASSWORD,
    authMethod: "LOGIN",
  },
});

export const sendTicketEmail = async (ticket) => {
  try {
    const listaDeProductos = ticket.products.map((product) =>
        `<li>Producto: <small>${product.product}</small> , precio: <small>${product.price}</small> , cantidad: <small>${product.quantity}</small> </li>`).join("");

    await transporter.sendMail({
      from: "Michael Kors",
      to: ticket.purchaser,
      subject: "Ticket de compra",
      html: `
            <div>
                <h2>Muchas gracias por comprar en Michael Kors</h2>
                <p>A continuacion le adjuntamos su ticket con cada detalle del mismo</p>
                <p>ID de compra: <small>${ticket._id}</small></p>
                <p>Codigo de Compra: <small>${ticket.code}</small></p>
                <p>Cantidad: <small>${ticket.amount}</small></p>
                <h3>Products</h3>
                <p>${listaDeProductos}</p>
                <h3>Total: $${ticket.total}</h3>
            </div>
          `,
      attachments: [],
    });
    return { message: "Email enviado" };
  } catch (error) {
    return {
      message: "Error con el remitente",
      error: error,
    };
  }
};

export const sendDeleteEmail = async (user) => {
  console.log(user.email);
  await transporter.sendMail({
    from: "Michael Kors",
    to: user.email,
    subject: `${user.first_name}, tu cuenta ha sido eliminada por inactividad`,
    html: `<p>Hola ${user.first_name},</p>
              
              <p>Por desgracia, debimos eliminar tu cuenta debido a la inactividad(</p>
              <p>A partir de este momento, su email se encuentra listo para volverse a utilizar.</p>
              <small>Si desea volver a nuestra web, debe registrarse nuevamente</small>
              </br>
              <p>Esperamos volver a verlo</p>
              <h2>Michael Kors</h2>
              
              `,
    attachments: [],
  });
  return "Email enviado";
};

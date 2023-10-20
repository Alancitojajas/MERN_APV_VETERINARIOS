import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  let transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EAMIL_PASS,
    },
  });
  //Enviar el email
  const {nombre, email, token} = datos;

  const info = await transport.sendMail({
    from: "APV - Administrador de pacientes de veterinaria",
    to: email,
    subject: "Comprueba tu cuenta con APV",
    text: "Comprueba tu cuenta con APV",
    html: `
      <p>Hola ${nombre} Comprueba tu cuenta en APV.</p>
      <p>Tu cuenta esta lista, solo debes dar click en el siguiente enlace:
      <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a> </p>

      <p>Si tu no creaste una cuenta, puedes ignorar este mensaje </p>
    `
  });

  console.log("Mensaje enviado: %s", info.messageId);
};

export default emailRegistro;

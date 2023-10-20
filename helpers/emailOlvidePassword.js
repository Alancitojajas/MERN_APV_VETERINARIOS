import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
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
    subject: "Reestablece tu password",
    text: "Recupera tu password",
    html: `
      <p>Hola ${nombre} has solicitado reestablecer tu password.</p>
      <p>Ve al siguiente enlace para generar un nuevo password:
      <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer contraseña</a> </p>

      <p>Si tu no creaste una cuenta, puedes ignorar este mensaje </p>
    `
  });

  console.log("Mensaje enviado: %s", info.messageId);
};

export default emailOlvidePassword;

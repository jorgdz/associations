const nodemailer = require("nodemailer");

const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: path.join(__dirname, "../.env"),
  });
}

const sendEmailUserCreate = (_user) => {
  var transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let message = {
    from: process.env.EMAIL_USER,
    to: _user.email,
    subject: "Bienvenido a " + process.env.APP_NAME + " ✔",
    html: `<!doctype html>
      <html ⚡4email>
        <head>
          <meta charset="utf-8">
          <style amp4email-boilerplate>body{visibility:hidden}</style>
          <script async src="https://cdn.ampproject.org/v0.js"></script>
          <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
        </head>
        <body>
          <p><b>Hola</b> ${_user.name} ${_user.lastname}, tu cuenta ha sido creada con éxito, por favor no entregues a nadie tus credenciales, luego de ingresar podrás cambiar tu clave en la sección de perfil:</p>
          <p><b>Puede ingresar con su correo o su nombre de usuario</b></p>
          <p>Correo: ${_user.email}</p>
          <p>Usuario: ${_user.username}</p>
          <p>Clave: ${_user.password}</p>
        </body>
      </html>`,
  };

  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log("Error occurred");
      console.log(error.message);
      return process.exit(1);
    } else {
      console.log(info.envelope);
      console.log(info.messageId);
      console.log(info.message.toString());

      return true;
    }
  });
};

module.exports = {
  sendEmailUserCreate,
};

const moment = require('moment');
const handlebars = require('handlebars');
handlebars.registerHelper('formatDate', function (datetime, format) {
  return moment(datetime).format(format);
});
const fs = require('fs');
const path = require('path');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendConfirmationEmail(user, token) {
  const msg = {
    to: {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email
    },
    from: {
      name: 'Napule',
      email: `${process.env.EMAIL_SENDER}`
    },
    subject: 'Confirmá tu nueva cuenta en Napule',
    html: `<p>Hola ${user.firstName},</p>
           <p>Porfa verificá tu cuenta haciendo click
           <a href="${process.env.UI_BASE_URL}/confirmation/${token.token}" alt="Click aca para verificar tu cuenta.">acá</a></p>
           <p>Tené en cuenta que el link vence en 24 horas.</p>`
  };

  return sgMail.send(msg);
}

async function sendPrepareEmail(order) {
  const source = fs.readFileSync(path.resolve(__dirname, './new-order-email.html'), 'utf-8');
  const template = handlebars.compile(source);
  const html = template(order);

  console.log(html);

  const msg = {
    to: {
      name: `Cocina Napule`,
      email: 'msenosiain@gmail.com'
    },
    from: {
      name: 'Napule',
      email: `${process.env.EMAIL_SENDER}`
    },
    subject: 'Nuevo Pedido',
    html: html
  };

  return sgMail.send(msg);
}

module.exports = {
  sendConfirmationEmail,
  sendPrepareEmail
};

const moment = require('moment');
moment.locale('es');
const Handlebars = require('handlebars');
Handlebars.registerHelper('formatDate', function (datetime, format) {
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
  const directionsURL = _buildDirectionsUrl(order.customer.address);
  const source = fs.readFileSync(path.resolve(__dirname, './new-order-email.html'), 'utf-8');
  const template = Handlebars.compile(source);
  const html = template({ ...order, directionsURL });

  console.log('HTML======', html);

  const msg = {
    to: {
      name: 'Cocina Napule',
      email: process.env.EMAIL_NEW_ORDER
    },
    from: {
      name: 'Napule',
      email: process.env.EMAIL_SENDER
    },
    subject: 'Nuevo Pedido',
    html
  };

  return sgMail.send(msg);
}
function _buildDirectionsUrl(address) {
  const destination = encodeURIComponent(`${address.street} ${address.number}, ${address.city.name}`);
  return `https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=${destination}`;
}

module.exports = {
  sendConfirmationEmail,
  sendPrepareEmail
};

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendConfirmationEmail(user, token) {
  const msg = {
    to: user.email,
    from: `${process.env.EMAIL_SENDER}`,
    subject: 'Confirmá tu nueva cuenta en Napule',
    html: `<p>Hola ${user.firstName},</p>
             <p>Porfa verificá tu cuenta haciendo click
             <a href="${process.env.UI_BASE_URL}/confirmation/${token.token}">acá</a></p>
             <p>Tené en cuenta que el link vence en 24 horas.</p>`
  };

  return sgMail.send(msg);
}

module.exports = {
  sendConfirmationEmail
};

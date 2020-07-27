const axios = require('axios');

const toObjectOptions = { getters: true, versionKey: false };

async function validateReCaptcha(req, res, next) {
  const { token, intendedAction } = req.body.reCAPTCHAOptions;

  try {
    var result = await axios.post(process.env.RECAPTCHA_VERIFY_URL, null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET,
        response: token
      }
    });

    const { score, action } = result.data;

    if (score < 0.5 || action !== intendedAction) {
      return res.status(403).json({ msg: intendedAction + ' recaptcha_error' });
    } else {
      next();
    }
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        msg: intendedAction + ' Error verifying recaptcha'
      })
    );
  }
}

module.exports = { toObjectOptions, validateReCaptcha };

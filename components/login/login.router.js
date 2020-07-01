const config = require('config');
const jwt = require('jsonwebtoken');
const util = require('util');
const express = require('express');
const router = express.Router();

const User = require('../user/user.model');

const signJWT = util.promisify(jwt.sign);

router.post('/', async (req, res) => {
  const data = req.body;

  try {
    let user = await checkCredentials(data.username, data.password);

    if (!user) {
      return res.status(401).json({ msg: 'user_unauthorized' });
    }
    user = user.toObject();
    const token = await signJWT({ id: user._id }, config.secret, {
      expiresIn: config.tokenExpir
    });
    res.send({ token, user });
  } catch (e) {
    console.log('-- ERROR: ', e);
    return res.status(400).json({});
  }
});

async function checkCredentials(username, pass) {
  const user = await User.findOne(
    { $or: [{ email: username }, { phone: username }], pass },
    { pass: 0, token: 0, apikey: 0 }
  );

  return user;
}

module.exports = router;

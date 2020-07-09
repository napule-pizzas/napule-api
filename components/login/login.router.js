const config = require('config');
const jwt = require('jsonwebtoken');
const util = require('util');
const express = require('express');
const router = express.Router();
const toObjectOptions = require('../../libs/util');

const User = require('../user/user.model');

const signJWT = util.promisify(jwt.sign);

router.post('/', async (req, res) => {
  const data = req.body;

  try {
    let user = await checkCredentials(data.username, data.password);

    if (!user) {
      return res.status(401).json({ msg: 'user_unauthorized' });
    }
    user = user.toObject(toObjectOptions);
    const token = await signJWT({ userId: user.id }, config.secret, {
      expiresIn: config.tokenExpir
    });
    res.send({ token, user });
  } catch (e) {
    console.log('-- ERROR: ', e);
    return res.status(400).json({});
  }
});

async function checkCredentials(username, password) {
  const user = await User.findOne(
    { $or: [{ email: username }, { phone: username }], password },
    { password: 0, createdAt: 0, updatedAt: 0 }
  );

  return user;
}

module.exports = router;

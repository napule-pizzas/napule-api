const jwt = require('jsonwebtoken');
const util = require('util');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const toObjectOptions = require('../../libs/util');

const { User } = require('../user/user.model');

const signJWT = util.promisify(jwt.sign);

router.post('/', async (req, res) => {
  const data = req.body;

  try {
    let user = await checkCredentials(data.username, data.password);

    if (!user) {
      return res.status(401).json({ msg: 'user_unauthorized' });
    }

    if (!user.active) {
      return res.status(403).json({ msg: 'user_not_active' });
    }

    user = user.toObject(toObjectOptions);

    delete user.passwordHash;

    const token = await signJWT({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TOKEN_EXP
    });
    res.send({ token, user });
  } catch (e) {
    console.log('-- ERROR: ', e);
    return res.status(400).json({});
  }
});

async function checkCredentials(username, password) {
  const user = await User.findOne(
    { $or: [{ email: username }, { phone: username }] },
    '+passwordHash'
  );

  if (user) {
    const match = await bcrypt.compare(password, user.passwordHash);
    return match ? user : null;
  } else {
    return null;
  }
}

module.exports = router;

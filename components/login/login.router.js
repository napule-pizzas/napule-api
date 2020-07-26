const jwt = require('jsonwebtoken');
const util = require('util');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const { User } = require('../user/user.model');

const signJWT = util.promisify(jwt.sign);

router.post('/', async (req, res) => {
  const data = req.body;

  try {
    let authUser = await checkCredentials(data.username, data.password);

    if (!authUser) {
      return res.status(401).json({ msg: 'user_unauthorized' });
    }

    if (!authUser.active) {
      return res.status(403).json({ msg: 'user_not_active', id: authUser.id });
    }

    const token = await signJWT(
      { userId: authUser.id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_TOKEN_EXP
      }
    );
    const { _id, user } = authUser.toObject();
    res.send({ token, user: { id: _id, ...user } });
  } catch (e) {
    console.log('-- ERROR: ', e);
    return res.status(400).json({});
  }
});

async function checkCredentials(username, password) {
  const authUser = await User.findOne(
    { 'user.email': username },
    '+passwordHash'
  );

  if (authUser) {
    const match = await bcrypt.compare(password, authUser.passwordHash);
    return match ? authUser : null;
  } else {
    return null;
  }
}

module.exports = router;

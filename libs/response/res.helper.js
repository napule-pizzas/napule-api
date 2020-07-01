module.exports = (req, res, next) => {
  res.ok = msg => res.status(200).json(msg);
  res.created = msg => res.status(201).json(msg);
  next();
};

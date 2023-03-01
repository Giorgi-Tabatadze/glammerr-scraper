const verifySecretToken = (req, res, next) => {
  const { secretToken } = req.body;

  console.log(secretToken);
  console.log(process.env.SECRET_TOKEN);

  if (secretToken !== process.env.SECRET_TOKEN) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};

module.exports = verifySecretToken;

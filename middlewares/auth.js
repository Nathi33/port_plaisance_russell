const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey";

module.exports = (req, res, next) => {
  const token = req.cookies.jwtToken; // Récupère le token JWT stocké dans le cookie
  console.log("Token reçu dans middleware :", req.cookies.jwtToken);

  if (!token) {
    return res
      .status(401)
      .json({ error: "Accès non autorisé. Veuillez vous connecter." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Stocke les informations de l'utilisateur dans req.user
    next();
  } catch (error) {
    console.error("Token invalide :", error);
    return res.status(401).json({ error: "Token invalide ou expiré." });
  }
};

const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey";

/**
 * Middleware pour vérifier le token JWT dans les cookies de la requête.
 * Ce middleware est utilisé pour authentifier l'utilisateur avant d'accéder aux ressources protégées.
 *
 * Le token est récupéré depuis le cookie `jwtToken`, puis il est vérifié à l'aide de la clé secrète.
 * Si le token est valide, les informations de l'utilisateur (décodées depuis le token) sont ajoutées à `req.user`.
 * Si le token est invalide ou manquant, une réponse d'erreur est envoyée.
 *
 * @function
 * @name verifyJwt
 * @param {Object} req - L'objet de la requête Express, contenant les cookies et les informations de la requête.
 * @param {Object} res - L'objet de la réponse Express, utilisé pour envoyer les erreurs ou continuer avec la requête.
 * @param {Function} next - La fonction qui permet de passer au middleware suivant si le token est valide.
 *
 * @throws {Object} 401 - Si le token est manquant ou invalide.
 */
module.exports = (req, res, next) => {
  const token = req.cookies.jwtToken; // Récupère le token JWT stocké dans le cookie

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

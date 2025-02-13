module.exports = function (req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect("/login"); // Redirection si l'utilisateur n'est pas connecté
  }
  next(); // Laisse passer la requête si l'utilisateur est connecté
};

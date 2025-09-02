// Middleware d'authentification simple
const authenticateUser = (req, res, next) => {
  // Pour l'instant, on laisse passer toutes les requêtes
  // TODO: Implémenter une vraie authentification
  next();
};

const requireRole = (roles) => {
  return (req, res, next) => {
    // Pour l'instant, on laisse passer toutes les requêtes
    // TODO: Vérifier les rôles de l'utilisateur
    next();
  };
};

module.exports = {
  authenticateUser,
  requireRole
};

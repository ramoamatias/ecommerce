import { logger } from "./logger.js";

export const middlewareIsAdmin = (req, res, next) => {
    let messageError = `ruta ${req.protocol}://${req.hostname}:${process.env.PORT}${req.originalUrl} metodo ${req.method} no autorizada`;
    const { isAdmin } = req.body; //si usamos POST,PUT y viene los datos dentro
    if (isAdmin) {
      delete req.body.isAdmin;
      next();
    } else {
      logger.error({ error: -1 ,description: messageError })
      res.status(400).json({ error: -1 ,description: messageError });
    }
};

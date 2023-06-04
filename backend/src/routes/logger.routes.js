import { Router } from "express"

const routerLogger = Router();

routerLogger.get("/fatal", (req,res) => {
    req.logger.fatal('FATAL: no funciona ningun producto')
    res.send("Error fatal")
})
routerLogger.get("/error", (req,res) => {
    req.logger.error('NO FATAL: problema al agregar al carrito el producto.')
    res.send("Error no fatal")
})
routerLogger.get("/warning", (req,res) => {
    req.logger.warning('WARNING: no hay suficiente stock en el producto.')
    res.send("Warning")
})
routerLogger.get("/debug", (req,res) => {
    req.logger.debug('DEBUG: todo funciona con éxito.')
    res.send("Debug")
})

export default routerLogger
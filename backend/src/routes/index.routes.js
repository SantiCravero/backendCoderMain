import { Router } from "express";

import routerCart from "./cart.routes.js";
import routerProduct from "./product.routes.js";
import routerSession from "./session.routes.js";
import routerUser from "./user.routes.js";
import routerGithub from "./github.routes.js";

const routerIndex = Router()

routerIndex.use("/product", routerProduct)
routerIndex.use("/api/cart", routerCart)
routerIndex.use("/api/session", routerSession)
routerIndex.use("/api/user", routerUser)
routerIndex.use("/authSession", routerGithub)

routerIndex.use("*", (req,res) => {
    res.status(404).send({
        error: "404 : No se encuentra la página solicitada"
    })
})

export default routerIndex
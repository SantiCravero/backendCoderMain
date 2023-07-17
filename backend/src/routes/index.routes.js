import { Router } from "express";

import routerCart from "./cart.routes.js";
import routerProduct from "./product.routes.js";
import routerSession from "./session.routes.js";
import routerUser from "./user.routes.js";
import routerGithub from "./github.routes.js";
import routerChat from "./chat.routes.js";
import routerMocking from "./mocking.routes.js";
import routerLogger from "./logger.routes.js";
import routerHandlebars from "./handlebars.routes.js";

const routerIndex = Router()

routerIndex.use("/api/product", routerProduct)
routerIndex.use("/api/cart", routerCart)
routerIndex.use("/api/session", routerSession)
routerIndex.use("/api/user", routerUser)
routerIndex.use("/authSession", routerGithub)
routerIndex.use("/chat", routerChat)
routerIndex.use("/mockingproducts", routerMocking)
routerIndex.use("/loggerTest", routerLogger)
routerIndex.use("/", routerHandlebars)

routerIndex.use("*", (req, res) => {
    res.status(404).send({
        error: "404 : No se encuentra la página solicitada"
    })
})

export default routerIndex
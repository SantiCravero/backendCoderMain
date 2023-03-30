import { Router } from "express";

import routerCart from "./cart.routes.js";
import routerChat from "./chat.routes.js";
import routerProduct from "./product.routes.js";
import routerSession from "./session.routes.js";
import routerUser from "./user.routes.js";

const routerIndex = Router()

routerIndex.use("/chat", routerChat);
routerIndex.use("/product", routerProduct)
routerIndex.use("/api/cart", routerCart)
routerIndex.use("/api/session", routerSession)
routerIndex.use("/api/user", routerUser)

export default routerIndex
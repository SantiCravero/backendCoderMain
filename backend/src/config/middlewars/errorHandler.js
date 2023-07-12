import { EErrors } from "../../utils/errors/enums.js";

export default (error, req, res, next) => {

    console.log(error.code)

    switch (error.code) {
        case EErrors.ROUTING_ERROR:
            req.logger.warning("Custom Error: Routing Error")
            res.send({ status: "Error", error: error.name, message: error.message, cause: error.cause })
            break;
        case EErrors.DATABASE_ERROR:
            req.logger.warning("Custom Error: Database Error")
            res.send({ status: "Error", error: error.name, message: error.message, cause: error.cause })
            break;
        case EErrors.INVALID_TYPES_ERROR:
            req.logger.warning("Custom Error: Invalid Types Error")
            res.send({ status: "Error", error: error.name, message: error.message, cause: error.cause })
            break;
        case EErrors.MISSING_FIELDS:
            req.logger.warning("Custom Error: Missing Fields Error")
            res.send({ status: "Error", error: error.name, message: error.message, cause: error.cause })
            break;
        default:
            req.logger.warning("Custom Error: Error no controlado")
            res.send({ status: "Error", error: "Error no controlado" })
            break;
    }
}

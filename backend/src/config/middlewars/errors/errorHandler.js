import { EErrors } from "../../../utils/errors/enums.js";

export default (error, req, res, next) => {

    console.log(error.code)

    switch (error.code) {
        case EErrors.ROUTING_ERROR:
            res.send({ status: "Error", error: error.name, message: error.message, cause: error.cause })
            break;
        case EErrors.DATABASE_ERROR:
            res.send({ status: "Error", error: error.name, message: error.message, cause: error.cause })
            break;

        case EErrors.INVALID_TYPES_ERROR:
            res.send({ status: "Error", error: error.name, message: error.message, cause: error.cause })
            break;
        case EErrors.MISSING_FIELDS:
            res.send({ status: "Error", error: error.name, message: error.message, cause: error.cause })
            break;
        default:
            res.send({ status: "Error", error: "Unhandled error" })
            break;
    }
}

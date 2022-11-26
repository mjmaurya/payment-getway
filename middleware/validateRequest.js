import { config } from "../config/testing.js";
import { createError } from "../utils/error.js"
import { LoG } from "../logger/logger.js";
const logger=new LoG("Request_Validator")
export const validateRequest = (req, res, next) => {
    try {
        const secret = config.api.secret
        const authorization = req.headers.authorization
        if (!authorization || authorization.indexOf("Basic ") === -1) {
            logger.error("Missing authorization in header")
            return next(createError(401, "Missing authorization in header"));
        }
        const token = authorization.split(" ")[1]
        if (token !== secret) {
            logger.error("Invalid authorization token")
            return next(createError(401, "Invalid authorization token"))
        }
        next();
    } catch (error) {
        return next(createError(500, "Internal Sever Error"))
    }
}
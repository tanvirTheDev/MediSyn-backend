"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateRequest = (schema) => {
    return async (req, res, next) => {
        console.log("DATA", req.body);
        try {
            await schema.parseAsync({
                body: req.body,
            });
            return next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.default = validateRequest;

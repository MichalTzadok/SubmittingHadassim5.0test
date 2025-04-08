import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * Middleware to authenticate requests using JWT.
 *
 * Verifies the presence and validity of a token in the Authorization header.
 * If valid, attaches the decoded user information to `req.user`.
 *
 * @param {Object} req - The HTTP request containing the Authorization header.
 * @param {Object} res - The HTTP response used to return error messages if unauthorized.
 * @param {Function} next - Callback to pass control to the next middleware function.
 * @returns {void}
 */
export const authenticateToken = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token from header

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT token
        req.user = verified; // Attach user payload to request
        console.log("req.user", req.user);
        next(); // Continue to next middleware/route
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session expired. Please log in again." });
        } else {
            return res.status(403).json({ message: "Invalid token." });
        }
    }
};

/**
 * Middleware to authorize store owner access.
 *
 * Only allows access if the authenticated user has the role "owner".
 *
 * @param {Object} req - The HTTP request with `req.user` populated by `authenticateToken`.
 * @param {Object} res - The HTTP response used to return an access-denied error.
 * @param {Function} next - Callback to pass control to the next middleware function.
 * @returns {void}
 */
export const authorizeOwner = (req, res, next) => {
    console.log("enter authorizeOwner");
    if (req.user.role !== "owner") {
        return res.status(403).json({ message: "Access Denied. Only the store owner can access this." });
    }
    next();
};

/**
 * Middleware to authorize supplier access.
 *
 * Only allows access if the authenticated user has the role "supplier".
 *
 * @param {Object} req - The HTTP request with `req.user` populated by `authenticateToken`.
 * @param {Object} res - The HTTP response used to return an access-denied error.
 * @param {Function} next - Callback to pass control to the next middleware function.
 * @returns {void}
 */
export const authorizeSupplier = (req, res, next) => {
    if (req.user.role !== "supplier") {
        return res.status(403).json({ message: "Access Denied. Only suppliers can access this." });
    }
    console.log("enter authorizeSupplier");
    next();
};

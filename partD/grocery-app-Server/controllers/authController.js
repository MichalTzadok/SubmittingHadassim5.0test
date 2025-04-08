import jwt from "jsonwebtoken";

/**
 * Login as store owner.
 * Validates the provided name and password against environment variables.
 * If valid, generates and returns a JWT token with "owner" role.
 */
export const loginOwner = async (req, res) => {
    const { name, password } = req.body;

    try {
        const isValidName = name === process.env.OWNER_NAME;
        const isValidPassword = password === process.env.OWNER_PASSWORD;

        // Check credentials
        if (!isValidName || !isValidPassword) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generate JWT token for the owner with 24h expiration
        const token = jwt.sign(
            { role: "owner" },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Send back the token and role
        res.status(200).json({ token, role: "owner" });

    } catch (error) {
        console.error("Error logging in as owner:", error);
        res.status(500).json({ message: "Server error, please try again later" });
    }
};

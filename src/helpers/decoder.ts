import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const decodedToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { adminId: string };
        return decoded;
    } catch (err) {
        return null;
    }
}
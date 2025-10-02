import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

interface DecodedToken {
    artistId?: string;
    adminId?: string;
}

export const decodedToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        return decoded;
    } catch (err) {
        return null;
    }
}
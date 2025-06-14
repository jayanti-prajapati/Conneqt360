// import { NextFunction, Request, Response } from "express";
// const jwt = require("jsonwebtoken");

// interface AuthenticatedRequest extends Request {
//   email?: string;
// }

//  const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//         const token = req.cookies.authToken || req.headers.authorization?.split(" ")[1];
//         if (!token) {
//             throw ({ message: 'Access denied: No token provided' })
//         }
//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//             req.email = decoded.email;
//             next();
//         }
//         catch (error) {
//             console.error("verifyToken error:", error);
//             return res.status(401).json({ error: "Invalid token" });
//         }
//     };

// export default verifyToken;
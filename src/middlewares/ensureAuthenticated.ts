import { NextFunction, Response, Request } from "express";
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticated(
    request: Request, 
    response: Response, 
    next: NextFunction
    ): void {

    const autHeader = request.headers.authorization;
    
    if (!autHeader) {
        throw new AppError('JWT token is missing', 401);
    }

    const [,token] = autHeader.split(' ');

    try {
        const decoded = verify(token, authConfig.jwt.secret);

        const { sub } = decoded as TokenPayload;

        request.user = {
            id: sub,
        }

        return next();
    } catch {
        throw new AppError('invalid JWT Token', 401);
    }
}
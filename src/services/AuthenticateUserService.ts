import { getRepository } from "typeorm";
import { compare } from 'bcryptjs';
import Users from "../models/Users";
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';


interface Request {
    email: string;
    password: string;
}

interface Response {
    user: Users;
    token: string;
}

class AuthenticateUserService {
    public async execute({ email, password }: Request): Promise<Response>{
        const userRepository = getRepository(Users);
        const user = await userRepository.findOne({
            where: { email }
        });

        if (!user) {
            throw new AppError('invalid email or password!', 401);
        }

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched){
            throw new AppError('invalid email or password!', 401);
        }

        const { secret, expiresIn } = authConfig.jwt; 

        const token = sign({}, secret,{
            subject: user.id,
            expiresIn,
        });

        return {
            user,
            token,
        };

    }
        
}

export default AuthenticateUserService;
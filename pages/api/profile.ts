import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import getData from '../../src/app/getData';
import jwt_decode from 'jwt-decode';
import { error } from 'console';
import { JwtPayload, decode } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const { getUser } = getData();
    if (req.method === 'GET'){
        try {
            const {
                query: {name, token},
                method,
              } = req;
            if(token){
                const decode = jwt.decode(token.toString()) as JwtPayload
                const json =  JSON.stringify(decode);
                console.log("Email is: " + decode.data)
                const user = await getUser(decode.data);
                if(user){
                    res.status(200).json(user);
                }
                res.status(401);
            }
            res.status(404).json({ error: 'Failed to get user ' + error });
        } catch (error) {
            res.status(500).json({ error: 'Failed to get user ' + error });
        }
    }
}
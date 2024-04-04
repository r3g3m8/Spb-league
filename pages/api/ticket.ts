import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import getData from '../../src/app/getData';
import jwt_decode from 'jwt-decode';
import { error } from 'console';
import { JwtPayload, decode } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const { getUser, getTicketsByUser, createTicket, getMatchById } = getData();
    if (req.method === 'POST'){
        try {
            const { token, matchId } = req.body;
            console.log("data = " + token + " " + matchId)
            const verify = jwt.verify(token.toString(), `${process.env.NEXTAUTH_SECRET}`);
            if(!verify){
                const rep = '/login';
                res.status(200).json({ success: true, rep });
                return;
            }
            if(token){
                const decode = jwt.decode(token.toString()) as JwtPayload
                console.log(decode.data)
                const user = await getUser(decode.data);
                if(!user){
                    res.status(401);
                }
                if(user){
                    
                    const create = await createTicket({matchId, fanId: user.id})

                    if(!create){
                        res.status(403);
                    }

                    res.status(200).json(create)
                }
            }
            res.status(404).json({ error: 'Failed to add Ticket ' + error });

        } catch (error) {
            res.status(500).json({ error: 'Failed to get user ' + error });
        }
    }

    else if(req.method === 'GET') {
        try {
            const {
                query: {userId},
            } = req;
            let idUser: number = 0;
              
            if(!userId || userId == undefined){
                console.log("User not found")
                res.status(400)
            }
            
            if(userId != undefined){
                idUser = +userId;
            }
            
            const tickets = await getTicketsByUser(idUser);
            res.status(200).json(tickets)
        } catch (error) {
            res.status(500).json({ error: 'Failed to get user ' + error });
        }
    }
}
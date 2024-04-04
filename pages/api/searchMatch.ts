import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import getData from '../../src/app/getData';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { findTeamByName } = getData();
    
    if(req.method === 'GET'){
        try {
            const { team, tour, date } = req.query;

            const matches = await prisma.match.findMany({
              where: {
                OR: [
                  { homeTeam: { name: { contains: team as string || '' } } },
                  { awayTeam: { name: { contains: team as string || '' } } },
                ],
                tour: parseInt(tour as string) || undefined,
                date: date as string || undefined,
              },
              include: {
                homeTeam: true, // Включаем данные о домашней команде
                awayTeam: true, // Включаем данные о гостевой команде
              },
            });

            const total = matches.length;

            if(matches && total){
              res.status(200).json({ matches, total });
            }
            
            res.status(400);
            } 
            catch (error) {
                res.status(500).json({ error: 'Failed to get match' });
            }
          }
  
    else {
        res.setHeader('Allow', ['POST', 'PUT', 'DELETE', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

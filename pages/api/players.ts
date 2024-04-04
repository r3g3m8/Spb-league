import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
        const teams = await prisma.player.findMany({
          include: {
            team: true,
          },
        });
        console.log(JSON.stringify(teams))
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete match' });
    }
  } 
  
  else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import getData from '../../../src/app/getData';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const teamId = req.query.id as string;
    const { findStadiumByName } = getData();
    if (req.method === 'PUT') {
      try {
        // Проверяем, что команда с таким ID существует
      const existingTeam = await prisma.team.findUnique({
        where: { id: parseInt(teamId, 10) },
      });
      if (!existingTeam) {
        return res.status(404).json({ error: 'Team not found' });
      }

      // Получаем данные из тела запроса
      const { teamName, teamLogo, stadium } = req.body;
      const stad = await findStadiumByName(stadium);
      console.log(teamName)
      if(!stad){
        return res.status(404).json({ error: 'Stadium not found' });
      }
      const updatedTeam = await prisma.team.update({
        where: { id: parseInt(teamId, 10) },
        data: {
          name: teamName,
          logo: teamLogo,
          stadiumId: stad.id
        },
      });
        res.status(200).json(updatedTeam);
      } catch (error) {
        console.error('Failed to update team:', error);
        res.status(500).json({ error: 'Failed to update team' });
      }
    } 
    else if (req.method === 'DELETE') {
        try {
          await prisma.team.delete({
            where: { id: parseInt(teamId, 10) },
          });
          res.status(200).json({ message: 'Team deleted successfully' });
        } catch (error) {
          console.error('Failed to delete team:', error);
          res.status(500).json({ error: 'Failed to delete team' });
        }
      }
    else {
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
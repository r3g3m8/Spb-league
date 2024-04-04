import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import getData from '../../src/app/getData';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { findTeamByName, getAllMatches, getMatchById } = getData();
  let err: string[] = [];
  if (req.method === 'POST') {
    // Добавление нового матча
    try {
      const { homeTeam, awayTeam, result, date, time, tour } = req.body;
      const findHomeTeam = await findTeamByName(homeTeam);
      const findAwayTeam = await findTeamByName(awayTeam);
      const tourNum: number = +tour;
      console.log(findHomeTeam?.name + " + " + tourNum)
      if(!tour){
        err.push("Не указан № тура");
      }
      if(!findHomeTeam){
        err.push("Поле Хозяева не содержит допустимую команду");
      }
      if(!findAwayTeam){
        err.push("Поле Гости не содержит допустимую команду");
      }
      if(err.length > 0){
        res.status(201).json({error: err});
      }
      if(findHomeTeam && findAwayTeam && tour){
        const newMatch = await prisma.match.create({
          data: {
            homeTeamId: findHomeTeam.id,
            awayTeamId: findAwayTeam.id,
            result: result,
            date: date,
            time,
            tour: tourNum
          },
        });
        res.status(200).json(newMatch);
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to add match' + error });
    }
  } else if (req.method === 'PUT') {
    // Изменение информации о матче
    try {
      const { id, homeTeam, awayTeam, result, date, time, tour } = req.body;
      const findHomeTeam = await findTeamByName(homeTeam);
      const findAwayTeam = await findTeamByName(awayTeam);
      const tourNum: number = +tour;
      if(!tour){
        err.push("Не указан № тура");
      }
      if(!findHomeTeam){
        err.push("Поле Хозяева не содержит допустимую команду");
      }
      if(!findAwayTeam){
        err.push("Поле Гости не содержит допустимую команду");
      }
      console.log(err[0])
      if(err.length > 0){
        res.status(201).json({error: err});
      }
      if(findHomeTeam && findAwayTeam){
        const updatedMatch = await prisma.match.update({
          where: { id },
          data: {
              homeTeamId: findHomeTeam.id,
              awayTeamId: findAwayTeam.id,
              result,
              date,
              time,
              tour: tourNum,
          },
        });
        res.status(200).json(updatedMatch);
      }
      
    } catch (error) {
      res.status(500).json({ error: 'Failed to update match' });
    }
  } else if (req.method === 'DELETE') {
    // Удаление информации о матче
    try {
      const { id } = req.body;
      console.log(id);
      await prisma.match.delete({
        where: {
          id: id,
        }
      });

      res.status(200).json({ message: 'Match deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete match' + error });
    }
  } else if(req.method === 'GET'){
    try {
      const {
        query: { matchId },
        method,
      } = req;
      if(matchId){
        const matches = await getAllMatches();
      if(matches){
        res.status(200).json(matches);
      }
      }
      const matches = await getAllMatches();
      if(matches){
        res.status(200).json(matches);
      }
    } catch (error) {
        res.status(500).json({ error: 'Failed to get match' + error });
    }
  }
  
  else {
    res.setHeader('Allow', ['POST', 'PUT', 'DELETE', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

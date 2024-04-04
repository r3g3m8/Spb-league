import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import getData from '../../src/app/getData';
import { join } from 'path'
import { writeFile } from 'fs/promises';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { findStadiumByName } = getData();
  if (req.method === 'POST') {
    try {
      const { stadium, teamName, teamLogo } = req.body;
      const stad = await findStadiumByName(stadium);
      console.log(stadium + teamLogo + teamName)
      console.log(teamLogo);
      const file: File | null = teamLogo as unknown as File
      if (!file) {
        throw new Error('No file uploaded')
      }
  
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
  
    // With the file data in the buffer, you can do whatever you want with it.
    // For this, we'll just write it to the filesystem in a new location
    const path = join('/', '/React/spb-league/public', file.name)
    await writeFile(path, buffer)
      if(stad){
        const newTeam = await prisma.team.create({
          data: {
            stadiumId: stad.id,
            name: teamName,
            logo: file.name,
          },
        });
        res.status(201).json(newTeam);
      }
      res.status(401).json('Failed to add');
    } catch (error) {
      console.error('Failed to add team:', error);
      res.status(500).json({ error: 'Failed to add team' });
    }
  } 
  else if(req.method === 'GET'){
    try {
        const teams = await prisma.team.findMany({
          include: {
            stadium: true,
          },
        });
        
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
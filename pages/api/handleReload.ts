import { PrismaClient } from '@prisma/client';
import { join } from 'path'
import { writeFile } from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Hello")
  console.log(req.method);
      if (req.method === 'POST') {
          try {
            await upload(req.body)
  
            res.status(401).json({ success: false, error: 'No any' })
          } 
          catch (error) {
            console.error('Error creating ABOBA:', error);
            res.status(500).json({ success: false, error: 'Internal Server ABOBA' });
          }
        } 
        else {
          res.status(405).json({ success: false, error: 'Method Not ABOBA' });
        }
  }

async function upload(data: any) {
  console.log(data);
    const file: File | null = data.image as unknown as File
    if (!file) {
      throw new Error('No file uploaded')
    }
  
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
  
    // With the file data in the buffer, you can do whatever you want with it.
    // For this, we'll just write it to the filesystem in a new location
    const path = join('/', '/React/spb-league/public', file.name)
    //await writeFile(path, buffer)
    console.log(`open ${path} to see the uploaded file`)
  
    const new_data = {
        authorId: 13,
        title: data.get("title"),
        content: data.get("content"),
        image: file.name,
        publish_date: data.get("publish_date")
    }
    await createNews(new_data)
    
    return { success: true }
  }

 async function createNews(params: any){
  const news = await prisma.news.create({
      data: {
          authorId: 13,
          title: params.title,
          content: params.content,
          image: params.image,
          publish_date: params.publish_date
      }
    }
  )
  return news
}
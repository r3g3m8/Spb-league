'use server'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';
import { join } from 'path'
import { readFile, writeFile } from 'fs/promises';
import { saveAs } from 'file-saver'
import multer from 'multer';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import { json } from 'stream/consumers';

const upload = multer({ dest: 'uploads/' })

const prisma = new PrismaClient();

type formType = {
  title?: string,
  content?: string,
  image: Blob,
  date?: string
}

async function saveFile(data: formType){
  console.log("Image is: " + JSON.stringify(data.image))
  //upload.single(req.get("image")?.toString())
  const file: File = data.image as File;
  if (!file) {
    throw new Error('No file uploaded')
  }
  //console.log("kkk: " + JSON.stringify(JSON.stringify(req.body.image)))
  saveAs(file, file.name)
  /*const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes)

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  const path = join('/', '/React/spb-league/public', (await file.text()).toString())
  await writeFile(path, buffer)
  console.log(`open ${path} to see the uploaded file`)*/

  const new_data = {
    authorId: 14,
    title: data.title,
    content: data.content,
    image: file.name,
    publish_date: data.date
}
console.log(new_data)
await createNews(new_data);
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method === 'POST'){
    await saveFile(req.body)
  }
else{
  res.status(405).json({ success: false, error: 'Method Not ABOBA' });
}

  res.status(200).json({ success: true});
}

async function createNews(params: any){
  const user = await prisma.user.findFirst({
    where: {
      id: params.authorId
    }
  })
    const news = await prisma.news.create({
        data: {
          authorId: params.authorId,
            title: params.title,
            content: params.content,
            image: params.image,
            publish_date: params.publish_date,
        }
      }
    )
    return news
  }
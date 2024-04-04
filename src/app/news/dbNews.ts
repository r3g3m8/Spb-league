'use server'

import { PrismaClient } from '@prisma/client';
import { join } from 'path'
import { writeFile } from 'fs/promises';

const prisma = new PrismaClient();

export default async function upload(
  data: FormData,) {

  console.log("DATTAA: " + data);
    const file: File | null = data.get("image") as unknown as File
    if (!file) {
      throw new Error('No file uploaded')
    }
  
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
  
    // With the file data in the buffer, you can do whatever you want with it.
    // For this, we'll just write it to the filesystem in a new location
    const path = join('/', '/React/spb-league/public', file.name)
    await writeFile(path, buffer)
    console.log(`open ${path} to see the uploaded file`)
  
    const new_data = {
        authorId: 14,
        title: data.get("title"),
        content: data.get("content"),
        image: file.name,
        publish_date: data.get("date")
    }
    await createNews(new_data);
    return { message: "Failed to create todo" };
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

   
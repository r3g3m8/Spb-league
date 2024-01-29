import type { NextApiRequest, NextApiResponse } from 'next'
import dbContext from '../../src/app/(auth)/login/main';
import jwt from 'jsonwebtoken';

type Login = {
    email: string,
    password: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {create, get} = dbContext();

    if (req.method === 'POST') {
        try {
          const user = await get(req.body);
          console.log(user);

          if(user == null){
            let token = jwt.sign({ data: req.body.email}, `${process.env.NEXTAUTH_SECRET}`,{ expiresIn: '1d' });
            const acreate = await create(req.body);
            res.status(200).json({ success: true, token, acreate });
            console.log("Success!!!" + token)
          }

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


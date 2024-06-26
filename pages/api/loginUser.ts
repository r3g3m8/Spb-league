import type { NextApiRequest, NextApiResponse } from 'next'
import dbContext from '../../src/app/(auth)/login/main';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { get } = dbContext();

    console.log(req.method);
    if (req.method === 'POST') {
        try {
          const user = await get(req.body);
          console.log(user);
          if(user != null){
            let token = jwt.sign({ data: user.email}, `${process.env.NEXTAUTH_SECRET}`,{ expiresIn: '1d' });
            res.status(200).json({ success: true, token, user });
            console.log("Success!!!" + token)
          }
          res.status(401).json({ success: false, error: 'No any user was found' + user })
        } 
        catch (error) {
          console.error('Error creating ABOBA:', error);
          res.status(500).json({ success: false, error: 'Internal Server ABOBA' });
        }
      } 
    else if(req.method === 'GET'){
      try {
        const {
          query: {name, token},
          method,
        } = req;

        if(token){
          const verify = jwt.verify(token.toString(), `${process.env.NEXTAUTH_SECRET}`);
          if(verify){
            res.status(200).json({ success: true, token });
          }
          res.status(401).json({ success: false, error: 'No any' })
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


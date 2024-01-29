import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default function dbContext(){

    async function create(register: any){
        const user = await prisma.user.create({
            data: {
                email: register.login,
                password: register.password,
                name: register.name,
                surname: register.surname
            },
        })    
        console.log(user);
        return user;
    }
    
    async function get(login: any){
        console.log(login);
        const user = await prisma.user.findFirst({
            where: {
              email: login.login,
              password: login.password
            },
        })
        console.log(user);
        return user;
    }
    
    return{
        create,
        get
    };
}


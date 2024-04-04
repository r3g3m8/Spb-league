import { PrismaClient } from '@prisma/client'
import { match } from 'assert';

const prisma = new PrismaClient();

type Match = {
    homeTeamId: number,
    awayTeamId: number
}

type Ticket = {
    matchId: number,
    fanId: number
}

export default function dbMatch(){
    async function getTicketsByUser(userId: number | undefined){
        const ticket = await prisma.ticket.findMany({
            where: {
                fanId: userId
            },
            include: {
                match: {
                    include: {
                        homeTeam: true,
                        awayTeam: true
                    }
                }
            }
        })
        return ticket;
    } 

    async function createTicket(params: Ticket){
        if(!params.fanId){
            return;
        }
        const ticket = await prisma.ticket.create({
            data: {
                matchId: params.matchId,
                fanId: params.fanId
            }
        })
        return ticket;
    } 

    async function createUser(register: any){
        const user = await prisma.user.create({
            data: {
                email: register.login,
                password: register.password,
                name: register.name,
                surname: register.surname
            },
        })    
        return user;
    }

    async function getTeamsById(params: Match) {
        const home_team = await prisma.team.findUnique({
            where: {
                id: params.homeTeamId,
              }},
        )
        const away_team = await prisma.team.findUnique({
            where: {
                id: params.awayTeamId,
              }},
        )
        return {home_team, away_team}
    }
    
    async function getAllMatches(){
        const matches = await prisma.match.findMany({
            orderBy: {
                tour: "asc"
            },
            include: {
                homeTeam: true,
                awayTeam: true,
              }
        });
        return matches;
    }

    async function getMatchById(matchId: number){
        const matches = await prisma.match.findFirst({
            where: {
                id: matchId
            },
            include: {
                homeTeam: true,
                awayTeam: true,
              }
        });
        return matches;
    }

    async function getUser(email: string){
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        return user;
    }

    async function getAllNews(){
        const news = await prisma.news.findMany();
        return news;
    }

    async function findTeamByName(teamName: string){
        const findTeam = await prisma.team.findFirst({
            where: {
              name: teamName
            }
          })
        return findTeam;
    }

    async function findStadiumByName(name: string){
        const findStadium = await prisma.stadium.findFirst({
            where: {
              name: name
            }
          })
        return findStadium;
    }

    async function getLatestNews(){
        const news = await prisma.news.findMany(
            {
                orderBy: {
                    publish_date: 'desc'
                },
                take: 3
            }
        );
        return news;
    }

    return{
        createUser,
        getTeamsById,
        getAllMatches,
        getMatchById,
        getAllNews,
        getLatestNews,
        findTeamByName,
        findStadiumByName,
        getUser,
        getTicketsByUser,
        createTicket
    };
}


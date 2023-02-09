import { PrismaClient } from '@prisma/client'
import dotenv from "dotenv";

const prisma = new PrismaClient()

export default prisma;


export function loadEnvs() { 
     let path = ".env";
     if (process.env.NODE_ENV === "test"){
        path = ".env.test";
     }

     dotenv.config({ path });
}
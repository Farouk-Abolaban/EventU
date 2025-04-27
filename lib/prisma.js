import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit during hot reloads.
const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const global = globalThis as unknown as { prisma: PrismaClient };
let prisma: PrismaClient;

if (process.env.USE_ACCELERATE === 'true') prisma = global.prisma || new PrismaClient().$extends(withAccelerate());
else prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
export { prisma };
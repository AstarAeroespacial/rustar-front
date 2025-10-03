import { createTRPCRouter } from "~/server/api/trpc";
import { satelliteRouter } from "~/server/api/routers/satellite";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  satellite: satelliteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

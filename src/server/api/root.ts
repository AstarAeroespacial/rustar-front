import { createTRPCRouter } from "~/server/api/trpc";
import { satelliteRouter } from "~/server/api/routers/satellite";
import { groundStationRouter } from "~/server/api/routers/groundStation";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  satellite: satelliteRouter,
  groundStation: groundStationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

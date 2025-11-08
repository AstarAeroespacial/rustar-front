import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const groundStationRouter = createTRPCRouter({
  // Get all ground stations
  getGroundStations: publicProcedure.query(async () => {
    // Mock data - this would come from your backend API
    return [
      {
        id: "GS-001",
        name: "Buenos Aires",
        location: {
          latitude: -34.6037,
          longitude: -58.3816,
          altitude: 25,
        },
      },
      {
        id: "GS-002",
        name: "Córdoba",
        location: {
          latitude: -31.4201,
          longitude: -64.1888,
          altitude: 390,
        },
      },
      {
        id: "GS-003",
        name: "Mendoza",
        location: {
          latitude: -32.8895,
          longitude: -68.8458,
          altitude: 760,
        },
      },
      {
        id: "GS-004",
        name: "Ushuaia",
        location: {
          latitude: -54.8019,
          longitude: -68.3030,
          altitude: 30,
        },
      },
    ];
  }),

  // Get a single ground station by ID
  getGroundStationById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Mock data - this would come from your backend API
      const stations = [
        {
          id: "GS-001",
          name: "Buenos Aires",
          location: {
            latitude: -34.6037,
            longitude: -58.3816,
            altitude: 25,
          },
        },
        {
          id: "GS-002",
          name: "Córdoba",
          location: {
            latitude: -31.4201,
            longitude: -64.1888,
            altitude: 390,
          },
        },
        {
          id: "GS-003",
          name: "Mendoza",
          location: {
            latitude: -32.8895,
            longitude: -68.8458,
            altitude: 760,
          },
        },
        {
          id: "GS-004",
          name: "Ushuaia",
          location: {
            latitude: -54.8019,
            longitude: -68.3030,
            altitude: 30,
          },
        },
      ];

      const station = stations.find((s) => s.id === input.id);

      if (!station) {
        throw new Error(`Ground station ${input.id} not found`);
      }

      return station;
    }),

  // Get satellite passes over a ground station
  getGroundStationPasses: publicProcedure
    .input(
      z.object({
        groundStationId: z.string(),
        startTime: z.number(),
        endTime: z.number(),
      })
    )
    .query(async ({ input }) => {
      // Mock data - satellites passing over this ground station
      const now = Date.now();

      return [
        {
          id: "pass-1",
          entityId: "SAT-001",
          entityName: "SAOCOM 1A",
          aos: now + 2 * 60 * 60 * 1000, // 2 hours from now
          los: now + 2 * 60 * 60 * 1000 + 12 * 60 * 1000, // 12 min duration
          maxElevation: 45.2,
        },
        {
          id: "pass-2",
          entityId: "SAT-002",
          entityName: "SAOCOM 1B",
          aos: now + 5 * 60 * 60 * 1000, // 5 hours from now
          los: now + 5 * 60 * 60 * 1000 + 10 * 60 * 1000, // 10 min duration
          maxElevation: 38.5,
        },
        {
          id: "pass-3",
          entityId: "SAT-001",
          entityName: "SAOCOM 1A",
          aos: now + 8 * 60 * 60 * 1000, // 8 hours from now
          los: now + 8 * 60 * 60 * 1000 + 14 * 60 * 1000, // 14 min duration
          maxElevation: 52.1,
        },
        {
          id: "pass-4",
          entityId: "SAT-003",
          entityName: "Aquarius",
          aos: now + 10 * 60 * 60 * 1000, // 10 hours from now
          los: now + 10 * 60 * 60 * 1000 + 8 * 60 * 1000, // 8 min duration
          maxElevation: 31.8,
        },
      ];
    }),
});


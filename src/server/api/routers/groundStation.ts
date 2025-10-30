import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const groundStationRouter = createTRPCRouter({
  // Get all ground stations
  getGroundStations: publicProcedure.query(async () => {
    // Mock data - this would come from your backend API
    return [
      {
        id: "GS-001",
        name: "Buenos Aires Ground Station",
        location: {
          latitude: -34.6037,
          longitude: -58.3816,
          altitude: 25,
        },
      },
      {
        id: "GS-002",
        name: "Córdoba Ground Station",
        location: {
          latitude: -31.4201,
          longitude: -64.1888,
          altitude: 390,
        },
      },
      {
        id: "GS-003",
        name: "Mendoza Ground Station",
        location: {
          latitude: -32.8895,
          longitude: -68.8458,
          altitude: 760,
        },
      },
      {
        id: "GS-004",
        name: "Ushuaia Ground Station",
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
          name: "Buenos Aires Ground Station",
          location: {
            latitude: -34.6037,
            longitude: -58.3816,
            altitude: 25,
          },
        },
        {
          id: "GS-002",
          name: "Córdoba Ground Station",
          location: {
            latitude: -31.4201,
            longitude: -64.1888,
            altitude: 390,
          },
        },
        {
          id: "GS-003",
          name: "Mendoza Ground Station",
          location: {
            latitude: -32.8895,
            longitude: -68.8458,
            altitude: 760,
          },
        },
        {
          id: "GS-004",
          name: "Ushuaia Ground Station",
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
});


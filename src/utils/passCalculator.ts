import * as satellite from 'satellite.js';

/**
 * Parse TLE string into line1 and line2
 * Handles both 2-line and 3-line TLE formats
 */
export function parseTLE(tle: string): { line1: string; line2: string } | null {
    const lines = tle
        .trim()
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    // TLE can be 2 or 3 lines (with satellite name as first line)
    // We need the lines that start with "1 " and "2 "
    const line1 = lines.find((line) => line.startsWith('1 '));
    const line2 = lines.find((line) => line.startsWith('2 '));

    if (line1 && line2) {
        return { line1, line2 };
    }
    return null;
}

export interface GroundStation {
    id: string;
    name: string;
    latitude: number; // degrees
    longitude: number; // degrees
    altitude: number; // meters
}

export interface SatellitePass {
    id: string;
    groundStationId: string;
    groundStationName: string;
    aos: number; // timestamp in ms
    los: number; // timestamp in ms
    maxElevation: number; // degrees
}

/**
 * Calculate satellite passes over a ground station
 * @param tleLine1 First line of TLE
 * @param tleLine2 Second line of TLE
 * @param groundStation Ground station coordinates
 * @param startTime Start time for pass search (timestamp in ms)
 * @param endTime End time for pass search (timestamp in ms)
 * @param minElevation Minimum elevation angle in degrees (default: 10)
 * @returns Array of passes
 */
export function calculatePasses(
    tleLine1: string,
    tleLine2: string,
    groundStation: GroundStation,
    startTime: number,
    endTime: number,
    minElevation: number = 10
): SatellitePass[] {
    const passes: SatellitePass[] = [];

    try {
        // Parse TLE
        const satrec = satellite.twoline2satrec(tleLine1, tleLine2);

        if (satrec.error) {
            console.error('TLE parse error:', satrec.error);
            return passes;
        }

        // Convert ground station to radians
        const observerGd = {
            longitude: satellite.degreesToRadians(groundStation.longitude),
            latitude: satellite.degreesToRadians(groundStation.latitude),
            height: groundStation.altitude / 1000, // convert to km
        };

        // Time step: check every 60 seconds
        const timeStep = 60 * 1000; // 60 seconds in ms
        let currentTime = startTime;

        let inPass = false;
        let passStart: number | null = null;
        let maxElev = 0;
        let passId = 0;

        while (currentTime <= endTime) {
            const date = new Date(currentTime);
            const positionAndVelocity = satellite.propagate(satrec, date);

            if (
                positionAndVelocity &&
                positionAndVelocity.position &&
                typeof positionAndVelocity.position !== 'boolean'
            ) {
                const positionEci = positionAndVelocity.position;

                // Calculate GMST
                const gmst = satellite.gstime(date);

                // Convert ECI to ECF
                const positionEcf = satellite.eciToEcf(positionEci, gmst);

                // Calculate look angles
                const lookAngles = satellite.ecfToLookAngles(
                    observerGd,
                    positionEcf
                );

                const elevationDeg = satellite.radiansToDegrees(
                    lookAngles.elevation
                );

                // Check if satellite is above minimum elevation
                if (elevationDeg >= minElevation) {
                    if (!inPass) {
                        // Pass is starting
                        inPass = true;
                        passStart = currentTime;
                        maxElev = elevationDeg;
                    } else {
                        // Continue pass, update max elevation
                        if (elevationDeg > maxElev) {
                            maxElev = elevationDeg;
                        }
                    }
                } else {
                    if (inPass) {
                        // Pass is ending
                        inPass = false;
                        if (passStart !== null) {
                            passes.push({
                                id: `pass-${groundStation.id}-${passId++}`,
                                groundStationId: groundStation.id,
                                groundStationName: groundStation.name,
                                aos: passStart,
                                los: currentTime,
                                maxElevation: maxElev,
                            });
                        }
                        passStart = null;
                        maxElev = 0;
                    }
                }
            }

            currentTime += timeStep;
        }

        // If pass is still active at end time, close it
        if (inPass && passStart !== null) {
            passes.push({
                id: `pass-${groundStation.id}-${passId++}`,
                groundStationId: groundStation.id,
                groundStationName: groundStation.name,
                aos: passStart,
                los: endTime,
                maxElevation: maxElev,
            });
        }
    } catch (error) {
        console.error('Error calculating passes:', error);
    }

    return passes;
}

/**
 * Calculate passes for multiple ground stations
 */
export function calculatePassesForMultipleStations(
    tleLine1: string,
    tleLine2: string,
    groundStations: GroundStation[],
    startTime: number,
    endTime: number,
    minElevation: number = 10
): SatellitePass[] {
    const allPasses: SatellitePass[] = [];

    for (const station of groundStations) {
        const stationPasses = calculatePasses(
            tleLine1,
            tleLine2,
            station,
            startTime,
            endTime,
            minElevation
        );
        allPasses.push(...stationPasses);
    }

    // Sort by AOS time
    return allPasses.sort((a, b) => a.aos - b.aos);
}

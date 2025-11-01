import { useMemo } from 'react';
import Timeline, {
    TimelineHeaders,
    SidebarHeader,
    DateHeader,
    TimelineMarkers,
    TodayMarker,
} from 'react-calendar-timeline';
import 'react-calendar-timeline/style.css';

interface Pass {
    id: string;
    groundStationId: string;
    groundStationName: string;
    aos: number; // Acquisition of Signal (timestamp in ms)
    los: number; // Loss of Signal (timestamp in ms)
    maxElevation: number;
}

interface PassTimelineProps {
    passes: Pass[];
    startTime: number;
    endTime: number;
}

const PassTimeline: React.FC<PassTimelineProps> = ({ passes, startTime, endTime }) => {
    // Transform passes into timeline format
    const { groups, items } = useMemo(() => {
        console.log('PassTimeline - passes:', passes);

        // Get unique ground stations
        const stationMap = new Map<string, string>();
        passes.forEach(pass => {
            stationMap.set(pass.groundStationId, pass.groundStationName);
        });

        // Create groups (one per ground station)
        const groups = Array.from(stationMap.entries()).map(([id, name]) => ({
            id,
            title: name,
        }));

        // Create items (one per pass)
        const items = passes.map(pass => ({
            id: pass.id,
            group: pass.groundStationId,
            title: `${pass.maxElevation.toFixed(1)}°`,
            start_time: pass.aos,
            end_time: pass.los,
        }));

        console.log('PassTimeline - groups:', groups);
        console.log('PassTimeline - items:', items);

        return { groups, items };
    }, [passes]);

    return (
        <div className='bg-dark-900 rounded-xl border border-dark-700 p-3 shadow-md'>
            <div>
                <Timeline
                    groups={groups}
                    items={items}
                    defaultTimeStart={startTime}
                    defaultTimeEnd={endTime}
                    canMove={false}
                    canResize={false}
                    canChangeGroup={false}
                    onTimeChange={(visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
                        // Restrict scrolling to the fetched time window
                        if (visibleTimeStart < startTime && visibleTimeEnd > endTime) {
                            updateScrollCanvas(startTime, endTime);
                        } else if (visibleTimeStart < startTime) {
                            updateScrollCanvas(startTime, startTime + (visibleTimeEnd - visibleTimeStart));
                        } else if (visibleTimeEnd > endTime) {
                            updateScrollCanvas(endTime - (visibleTimeEnd - visibleTimeStart), endTime);
                        } else {
                            updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
                        }
                    }}
                >
                    <TimelineHeaders>
                        <SidebarHeader>
                            {({ getRootProps }) => (
                                <div {...getRootProps()}></div>
                            )}
                        </SidebarHeader>
                        <DateHeader unit="primaryHeader" />
                        <DateHeader />
                    </TimelineHeaders>
                    <TimelineMarkers>
                        <TodayMarker>
                            {({ styles }) => (
                                <div style={{ ...styles, backgroundColor: '#ef4444', width: '2px' }} />
                            )}
                        </TodayMarker>
                    </TimelineMarkers>
                </Timeline>
            </div>
        </div>
    );
};

export default PassTimeline;

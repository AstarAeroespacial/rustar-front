import { useMemo } from 'react';
import { Tooltip } from 'react-tooltip';
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
    hoveredPassId?: string | null;
    onPassHover?: (passId: string | null) => void;
}

const PassTimeline: React.FC<PassTimelineProps> = ({
    passes,
    startTime,
    endTime,
    hoveredPassId,
    onPassHover,
}) => {
    // Transform passes into timeline format
    const { groups, items } = useMemo(() => {
        // Get unique ground stations
        const stationMap = new Map<string, string>();
        passes.forEach((pass) => {
            stationMap.set(pass.groundStationId, pass.groundStationName);
        });

        // Create groups (one per ground station)
        const groups = Array.from(stationMap.entries()).map(([id, name]) => ({
            id,
            title: name,
        }));

        // Create items (one per pass) - include hover state in item data
        const items = passes.map((pass) => ({
            id: pass.id,
            group: pass.groundStationId,
            title: '',
            start_time: pass.aos,
            end_time: pass.los,
            isHovered: hoveredPassId === pass.id,
        }));

        return { groups, items };
    }, [passes, hoveredPassId]);

    return (
        <div className='bg-[#090d11] rounded-xl border border-[#13181D] shadow-md overflow-hidden'>
            <div>
                <Timeline
                    groups={groups}
                    items={items}
                    defaultTimeStart={startTime}
                    defaultTimeEnd={endTime}
                    sidebarWidth={0}
                    lineHeight={40}
                    timeSteps={{
                        second: 1,
                        minute: 15,
                        hour: 1,
                        day: 0.5,
                        month: 1,
                        year: 1,
                    }}
                    itemRenderer={({ item, itemContext, getItemProps }) => {
                        const pass = passes.find((p) => p.id === item.id);
                        const isHovered = item.isHovered || false;
                        const props = getItemProps({});

                        const finalBackground = isHovered
                            ? '#f97316'
                            : props.style?.background;

                        return (
                            <div
                                {...props}
                                data-tooltip-id='pass-tooltip'
                                data-tooltip-content={
                                    pass ? pass.groundStationName : ''
                                }
                                onMouseEnter={() => onPassHover?.(item.id)}
                                onMouseLeave={() => onPassHover?.(null)}
                                style={{
                                    ...props.style,
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                }}
                            >
                                <div
                                    style={{
                                        height: '100%',
                                        overflow: 'hidden',
                                        background: finalBackground,
                                        borderRadius: '4px',
                                    }}
                                />
                            </div>
                        );
                    }}
                    canMove={false}
                    canResize={false}
                    canChangeGroup={false}
                    onTimeChange={(
                        visibleTimeStart,
                        visibleTimeEnd,
                        updateScrollCanvas
                    ) => {
                        // Restrict scrolling to the fetched time window (today + tomorrow)
                        if (
                            visibleTimeStart < startTime &&
                            visibleTimeEnd > endTime
                        ) {
                            updateScrollCanvas(startTime, endTime);
                        } else if (visibleTimeStart < startTime) {
                            updateScrollCanvas(
                                startTime,
                                startTime + (visibleTimeEnd - visibleTimeStart)
                            );
                        } else if (visibleTimeEnd > endTime) {
                            updateScrollCanvas(
                                endTime - (visibleTimeEnd - visibleTimeStart),
                                endTime
                            );
                        } else {
                            updateScrollCanvas(
                                visibleTimeStart,
                                visibleTimeEnd
                            );
                        }
                    }}
                    buffer={1}
                >
                    <TimelineHeaders>
                        <SidebarHeader>
                            {({ getRootProps }) => (
                                <div {...getRootProps()}></div>
                            )}
                        </SidebarHeader>
                        <DateHeader
                            unit='primaryHeader'
                            labelFormat={([startTime]) => {
                                return startTime.format('MMMM D');
                            }}
                        />
                        <DateHeader />
                    </TimelineHeaders>
                    <TimelineMarkers>
                        <TodayMarker>
                            {({ styles }) => (
                                <div
                                    style={{
                                        ...styles,
                                        backgroundColor: '#ef4444',
                                        width: '2px',
                                    }}
                                />
                            )}
                        </TodayMarker>
                    </TimelineMarkers>
                </Timeline>
            </div>
            <Tooltip
                id='pass-tooltip'
                place='top'
                style={{
                    backgroundColor: '#141B23',
                    color: '#e2e8f0',
                    borderRadius: '6px',
                    border: '1px solid #13181D',
                    fontSize: '12px',
                    padding: '6px 10px',
                    zIndex: 1000,
                }}
            />
        </div>
    );
};

export default PassTimeline;

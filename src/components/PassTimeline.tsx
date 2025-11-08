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
    entityId: string;
    entityName: string;
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

        // Get unique entities (ground stations or satellites)
        const entityMap = new Map<string, string>();
        passes.forEach(pass => {
            entityMap.set(pass.entityId, pass.entityName);
        });

        // Create groups (one per entity)
        const groups = Array.from(entityMap.entries()).map(([id, name]) => ({
            id,
            title: name,
        }));

        // Create items (one per pass)
        const items = passes.map(pass => ({
            id: pass.id,
            group: pass.entityId,
            title: '',
            start_time: pass.aos,
            end_time: pass.los,
        }));

        console.log('PassTimeline - groups:', groups);
        console.log('PassTimeline - items:', items);

        return { groups, items };
    }, [passes]);

    return (
        <div className='bg-dark-900 rounded-xl border border-dark-700 shadow-md overflow-hidden'>
            <div>
                <Timeline
                    groups={groups}
                    items={items}
                    defaultTimeStart={startTime}
                    defaultTimeEnd={endTime}
                    sidebarWidth={0}
                    timeSteps={{
                        second: 1,
                        minute: 15,
                        hour: 1,
                        day: 0.5,
                        month: 1,
                        year: 1
                    }}
                    itemRenderer={({ item, itemContext, getItemProps }) => {
                        const pass = passes.find(p => p.id === item.id);
                        const props = getItemProps({});
                        return (
                            <div
                                {...props}
                                data-tooltip-id="pass-tooltip"
                                data-tooltip-content={pass ? pass.entityName : ''}
                            >
                                <div style={{ height: '100%', overflow: 'hidden' }}></div>
                            </div>
                        );
                    }}
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
                    buffer={1}
                >
                    <TimelineHeaders>
                        <SidebarHeader>
                            {({ getRootProps }) => (
                                <div {...getRootProps()}></div>
                            )}
                        </SidebarHeader>
                        <DateHeader
                            unit="primaryHeader"
                            labelFormat={([startTime]) => {
                                return startTime.format('MMMM D');
                            }}
                        />
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
            <Tooltip
                id="pass-tooltip"
                place="top"
                style={{
                    backgroundColor: '#1e293b',
                    color: '#e2e8f0',
                    borderRadius: '6px',
                    border: '1px solid #334155',
                    fontSize: '12px',
                    padding: '6px 10px',
                    zIndex: 1000
                }}
            />
        </div>
    );
};

export default PassTimeline;

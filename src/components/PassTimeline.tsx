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

// Generic timeline item interface
interface TimelineItem {
    id: string;
    groupId: string;
    groupName: string;
    startTime: number; // timestamp in ms
    endTime: number; // timestamp in ms
}

interface TimelineProps<T extends TimelineItem> {
    items: T[];
    startTime: number;
    endTime: number;
    hoveredItemId?: string | null;
    onItemHover?: (itemId: string | null) => void;
    tooltipContent?: (item: T) => string;
}

const PassTimeline = <T extends TimelineItem>({
    items,
    startTime,
    endTime,
    hoveredItemId,
    onItemHover,
    tooltipContent,
}: TimelineProps<T>) => {
    // Transform items into timeline format
    const { groups, timelineItems } = useMemo(() => {
        // Get unique groups
        const groupMap = new Map<string, string>();
        items.forEach((item) => {
            groupMap.set(item.groupId, item.groupName);
        });

        // Create groups
        const groups = Array.from(groupMap.entries()).map(([id, name]) => ({
            id,
            title: name,
        }));

        // Create timeline items - include hover state in item data
        const timelineItems = items.map((item) => ({
            id: item.id,
            group: item.groupId,
            title: '',
            start_time: item.startTime,
            end_time: item.endTime,
            isHovered: hoveredItemId === item.id,
            originalItem: item,
        }));

        return { groups, timelineItems };
    }, [items, hoveredItemId]);

    return (
        <div className='bg-[#090d11] rounded-xl border border-[#13181D] shadow-md overflow-hidden'>
            {/* Wrapper with horizontal scroll for mobile */}
            <div className='overflow-x-auto'>
                <div className='min-w-[640px]'>
                    <Timeline
                        groups={groups}
                        items={timelineItems}
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
                            const timelineItem = timelineItems.find(
                                (ti) => ti.id === item.id
                            );
                            const isHovered = timelineItem?.isHovered || false;
                            const originalItem = timelineItem?.originalItem;
                            const props = getItemProps({});

                            const finalBackground = isHovered
                                ? '#f97316'
                                : props.style?.background;

                            const tooltipText =
                                originalItem && tooltipContent
                                    ? tooltipContent(originalItem)
                                    : '';

                            return (
                                <div
                                    {...props}
                                    data-tooltip-id='timeline-tooltip'
                                    data-tooltip-content={tooltipText}
                                    onMouseEnter={() => onItemHover?.(item.id)}
                                    onMouseLeave={() => onItemHover?.(null)}
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
                                    startTime +
                                        (visibleTimeEnd - visibleTimeStart)
                                );
                            } else if (visibleTimeEnd > endTime) {
                                updateScrollCanvas(
                                    endTime -
                                        (visibleTimeEnd - visibleTimeStart),
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
            </div>
            <Tooltip
                id='timeline-tooltip'
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

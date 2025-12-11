import { useMemo, useRef, useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import Timeline, {
    TimelineHeaders,
    SidebarHeader,
    DateHeader,
    TimelineMarkers,
    TodayMarker,
    CustomMarker,
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
    const timelineRef = useRef<HTMLDivElement>(null);

    // Calculate initial zoom level (85% of full range)
    const initialRange = (endTime - startTime) * 0.7;
    const [visibleTimeStart, setVisibleTimeStart] = useState(startTime);
    const [visibleTimeEnd, setVisibleTimeEnd] = useState(
        startTime + initialRange
    );

    // Touch gesture handling
    const touchRef = useRef({
        lastDistance: 0,
        lastCenterX: 0,
        isPinching: false,
    });

    useEffect(() => {
        const element = timelineRef.current;
        if (!element) return;

        let touchStartX = 0;
        let scrollStartX = 0;

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 1) {
                // Single touch - prepare for pan
                const touch = e.touches[0];
                if (!touch) return;
                touchStartX = touch.clientX;
                const scrollContainer =
                    element.querySelector('.overflow-x-auto');
                scrollStartX = scrollContainer?.scrollLeft || 0;
                touchRef.current.isPinching = false;
            } else if (e.touches.length === 2) {
                // Two fingers - prepare for pinch zoom
                e.preventDefault();
                touchRef.current.isPinching = true;

                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                if (!touch1 || !touch2) return;

                // Calculate distance between fingers
                const dx = touch2.clientX - touch1.clientX;
                const dy = touch2.clientY - touch1.clientY;
                touchRef.current.lastDistance = Math.sqrt(dx * dx + dy * dy);

                // Calculate center point
                touchRef.current.lastCenterX =
                    (touch1.clientX + touch2.clientX) / 2;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 2 && touchRef.current.isPinching) {
                // Pinch zoom
                e.preventDefault();

                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                if (!touch1 || !touch2) return;

                // Calculate new distance
                const dx = touch2.clientX - touch1.clientX;
                const dy = touch2.clientY - touch1.clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Calculate zoom factor
                const scale = distance / touchRef.current.lastDistance;

                // Calculate new time range
                const currentRange = visibleTimeEnd - visibleTimeStart;
                const newRange = currentRange / scale;

                // Limit zoom range (min 30 minutes, max full range)
                const minRange = 30 * 60 * 1000; // 30 minutes in ms
                const maxRange = endTime - startTime;
                const clampedRange = Math.max(
                    minRange,
                    Math.min(maxRange, newRange)
                );

                // Calculate center point in time
                const totalRange = endTime - startTime;
                const centerRatio =
                    (visibleTimeStart +
                        (visibleTimeEnd - visibleTimeStart) / 2 -
                        startTime) /
                    totalRange;

                // Calculate new start and end times centered around the pinch point
                let newStart =
                    visibleTimeStart + (currentRange - clampedRange) / 2;
                let newEnd = newStart + clampedRange;

                // Ensure we don't go beyond boundaries
                if (newStart < startTime) {
                    newStart = startTime;
                    newEnd = newStart + clampedRange;
                }
                if (newEnd > endTime) {
                    newEnd = endTime;
                    newStart = newEnd - clampedRange;
                }

                setVisibleTimeStart(newStart);
                setVisibleTimeEnd(newEnd);

                touchRef.current.lastDistance = distance;
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (e.touches.length < 2) {
                touchRef.current.isPinching = false;
            }
        };

        element.addEventListener('touchstart', handleTouchStart, {
            passive: false,
        });
        element.addEventListener('touchmove', handleTouchMove, {
            passive: false,
        });
        element.addEventListener('touchend', handleTouchEnd);

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [startTime, endTime, visibleTimeStart, visibleTimeEnd]);

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
        <div
            ref={timelineRef}
            className='bg-[#090d11] rounded-xl border border-[#13181D] shadow-md overflow-hidden'
        >
            {/* Touch hint for mobile */}
            <div className='sm:hidden px-4 py-2 bg-[#0B0F14] border-b border-[#13181D] text-xs text-gray-400 text-center'>
                <span className='inline-flex items-center gap-1'>
                    <svg
                        className='h-4 w-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11'
                        />
                    </svg>
                    Usa dos dedos para hacer zoom
                </span>
            </div>
            {/* Wrapper with horizontal scroll for mobile */}
            <div className='overflow-x-auto'>
                <div className='min-w-[640px]'>
                    <Timeline
                        groups={groups}
                        items={timelineItems}
                        visibleTimeStart={visibleTimeStart}
                        visibleTimeEnd={visibleTimeEnd}
                        sidebarWidth={0}
                        lineHeight={40}
                        minZoom={30 * 60 * 1000}
                        maxZoom={(endTime - startTime) * 0.7}
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
                            newVisibleTimeStart,
                            newVisibleTimeEnd,
                            updateScrollCanvas
                        ) => {
                            const newRange =
                                newVisibleTimeEnd - newVisibleTimeStart;

                            // Restrict scrolling within the time window (now to end of tomorrow)
                            let adjustedStart = newVisibleTimeStart;
                            let adjustedEnd = newVisibleTimeEnd;

                            // Don't allow scrolling before startTime (now)
                            if (adjustedStart < startTime) {
                                adjustedStart = startTime;
                                adjustedEnd = startTime + newRange;
                            }

                            // Don't allow scrolling after endTime (end of tomorrow)
                            if (adjustedEnd > endTime) {
                                adjustedEnd = endTime;
                                adjustedStart = endTime - newRange;
                            }

                            // Update state and canvas
                            setVisibleTimeStart(adjustedStart);
                            setVisibleTimeEnd(adjustedEnd);
                            updateScrollCanvas(adjustedStart, adjustedEnd);
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
                            {/* Midnight marker - start of tomorrow */}
                            <CustomMarker
                                date={(() => {
                                    const midnight = new Date();
                                    midnight.setHours(24, 0, 0, 0);
                                    return midnight.getTime();
                                })()}
                            >
                                {({ styles }) => (
                                    <div
                                        style={{
                                            ...styles,
                                            backgroundColor: '#3b82f6',
                                            width: '2px',
                                            zIndex: 80,
                                        }}
                                    />
                                )}
                            </CustomMarker>
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

import { format as dateFnsFormat } from 'date-fns';

export function toGMT3(date: Date | number): Date {
    const d = typeof date === 'number' ? new Date(date) : date;
    return new Date(d.getTime() - 3 * 60 * 60 * 1000);
}

export function formatGMT3(date: Date | number, formatString: string): string {
    const gmt3Date = toGMT3(date);
    return dateFnsFormat(gmt3Date, formatString);
}

export function toLocaleStringGMT3(date: Date | number): string {
    const gmt3Date = toGMT3(date);
    const day = String(gmt3Date.getUTCDate()).padStart(2, '0');
    const month = String(gmt3Date.getUTCMonth() + 1).padStart(2, '0');
    const year = gmt3Date.getUTCFullYear();
    const hours = String(gmt3Date.getUTCHours()).padStart(2, '0');
    const minutes = String(gmt3Date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(gmt3Date.getUTCSeconds()).padStart(2, '0');
    
    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}

export function toISOStringGMT3(date: Date | number): string {
    const gmt3Date = toGMT3(date);
    return gmt3Date.toISOString().replace('Z', '-03:00');
}

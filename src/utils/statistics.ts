export function getStats(arr: number[]) {
    if (!arr.length) return { avg: 0, min: 0, max: 0 };
    const sum = arr.reduce((a, b) => a + b, 0);
    const avg = sum / arr.length;
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return { avg, min, max };
}

export function formatNumber(n: number, digits = 2) {
    return n.toLocaleString(undefined, {
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
    });
}

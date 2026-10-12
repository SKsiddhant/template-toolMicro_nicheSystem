// Pure scheduling logic, kept separate from the DOM code so it can be tested (see tests/).
(function (root) {
    const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

    // subjects: [{ name, priority }], totalHours: number of study hours per day.
    // Returns [{ name, priority, hours }] where hours sum to totalHours (rounded to 0.1).
    function allocateHours(subjects, totalHours) {
        const hours = Number.isFinite(totalHours) ? clamp(totalHours, 1, 16) : 4;
        const clean = subjects
            .map((s) => ({
                name: String(s.name ?? '').trim(),
                // Out-of-range or blank priorities used to slip through (min/max on <input> are not enforced by JS)
                // and a negative value could make the total zero, producing NaN/Infinity hours.
                priority: clamp(Number.isFinite(parseInt(s.priority, 10)) ? parseInt(s.priority, 10) : 1, 1, 5),
            }))
            .filter((s) => s.name);
        const totalPriority = clean.reduce((sum, s) => sum + s.priority, 0);
        if (!totalPriority) return [];

        // Largest-remainder rounding in tenths of an hour, so the rows add up to exactly `hours`
        // (plain toFixed(1) on each row could add up to 3.9 or 4.1 for a 4h day).
        const tenths = Math.round(hours * 10);
        const raw = clean.map((s) => (s.priority / totalPriority) * tenths);
        const floor = raw.map(Math.floor);
        let left = tenths - floor.reduce((a, b) => a + b, 0);
        raw.map((r, i) => [r - floor[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => {
            if (left > 0) { floor[i]++; left--; }
        });
        return clean.map((s, i) => ({ ...s, hours: floor[i] / 10 }));
    }

    if (typeof module !== 'undefined' && module.exports) module.exports = { allocateHours };
    else root.allocateHours = allocateHours;
})(typeof window !== 'undefined' ? window : globalThis);

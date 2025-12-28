export default function filter(object: any, include?: string[], exclude?: string[]) {
    if (exclude) {
        // Use Set for O(1) lookup instead of O(n) array.includes()
        const excludeSet = new Set(exclude.map(field => field.trim()));
        return Object.keys(object).reduce((acc, key) => {
            if (!excludeSet.has(key)) {
                acc[key] = object[key];
            }
            return acc;
        }, {} as Record<string, any>);
    } else if (include) {
        // Use Set for O(1) lookup instead of O(n) array.includes()
        // Trim whitespace for consistency with exclude handling
        const includeSet = new Set(include.map(field => field.trim()));
        // Iterate over object keys and check if they're in the include set
        return Object.keys(object).reduce((acc, key) => {
            if (includeSet.has(key)) {
                acc[key] = object[key];
            }
            return acc;
        }, {} as Record<string, any>);
    }

    return object;
}
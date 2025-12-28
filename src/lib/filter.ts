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
        const includeSet = new Set(include);
        return includeSet.size > 0 
            ? Array.from(includeSet).reduce((acc, key) => {
                if (key in object) {
                    acc[key] = object[key];
                }
                return acc;
            }, {} as Record<string, any>)
            : {};
    }

    return object;
}
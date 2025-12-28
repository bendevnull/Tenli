export default function filter(object: any, include?: string[], exclude?: string[]) {
    if (exclude) {
        // Use reduce to create a new object with excluded fields in one pass
        return Object.keys(object).reduce((acc, key) => {
            if (!exclude.includes(key)) {
                acc[key] = object[key];
            }
            return acc;
        }, {} as Record<string, any>);
    } else if (include) {
        // Use reduce to create a new object with only included fields in one pass
        return include.reduce((acc, key) => {
            if (key in object) {
                acc[key] = object[key];
            }
            return acc;
        }, {} as Record<string, any>);
    }

    return object;
}
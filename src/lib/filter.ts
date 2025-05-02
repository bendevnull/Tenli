export default function filter(object: any, include?: string[], exclude?: string[]) {
    var filteredObject = { ...object };
    
    if (exclude) {
        exclude.forEach(field => {
            delete (filteredObject as Record<string, any>)[field.trim()];
        });
    } else if (include) {
        Object.keys(filteredObject).forEach(key => {
            if (!include.includes(key)) {
                delete (filteredObject as Record<string, any>)[key];
            }
        });
    }

    return filteredObject;
}
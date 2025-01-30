export function getUnique<T, R>(items: T[], transform: (item: T) => R | R[]): R[] {
    const valuesSet = new Set<R>();

    for (const item of items) {
        const val = transform(item);
        if (Array.isArray(val)) val.forEach((v) => valuesSet.add(v));
        else valuesSet.add(val);
    }

    return Array(...valuesSet.values());
}

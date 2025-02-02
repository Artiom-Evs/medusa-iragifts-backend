export function buildSearchProductsFilter(
    params: Record<string, string | number | boolean | undefined | (string | number)[]>,
) {
    const filter = Object.entries(params)
        .filter(([_, value]) => value != undefined)
        .reduce((filter, [key, value]) => {
            if (Array.isArray(value)) filter.push(value.map((v) => `${key} = "${v}"`).join(" OR "));
            else filter.push(`${key} = "${value}"`);

            return filter;
        }, [] as (string | string[])[]);

    return filter;
}

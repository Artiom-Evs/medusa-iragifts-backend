import { ProductDTO } from "@medusajs/framework/types";
import { ProductIndexDocument } from "../types";
import { getUnique } from "./get-unique";

export function transformProduct(p: ProductDTO): ProductIndexDocument {
    const baseFields: ProductIndexDocument = {
        id: p.id,
        external_id: p.external_id ?? "",
        handle: p.handle,
        title: p.title,
        description: p.description ?? "",
        thumbnail: p.thumbnail ?? "",
        category_id: p.categories?.map((c) => c.id) ?? [],
        variant_sku: getUnique(p.variants, (v) => v.sku ?? ""),
        variant_title: getUnique(p.variants, (v) => v.title),
        supplier: (p.metadata?.supplier as string) ?? "",
    };

    const options = p.options.reduce((opts, opt) => {
        opts[`${opt.title}`] = getUnique(opt.values, (v) => v.value) as string[];
        return opts;
    }, {} as Record<string, string[]>);

    return {
        ...baseFields,
        ...options,
    };
}

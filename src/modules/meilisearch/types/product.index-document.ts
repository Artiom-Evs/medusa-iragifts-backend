export interface ProductIndexDocument {
    id: string;
    external_id: string;
    handle: string;
    title: string;
    description: string;
    thumbnail: string;
    category_id: string[];
    variant_sku: string[];
    variant_title: string[];
    supplier?: string;
    color?: string[];
    base_color?: string[];
    size?: string[];
}

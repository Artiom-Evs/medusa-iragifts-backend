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
    option_supplier?: string;
    option_color?: string[];
    option_base_color?: string[];
    option_size?: string[];
}

import z from "zod";

export const SearchProductsQueryParamsSchema = z.object({
    q: z.string().optional(),
    filter: z
        .object({
            supplier: z
                .string()
                .optional()
                .transform((s) => s?.split(",")),
            color: z
                .string()
                .optional()
                .transform((s) => s?.split(",")),
            base_color: z
                .string()
                .optional()
                .transform((s) => s?.split(",")),
            size: z
                .string()
                .optional()
                .transform((s) => s?.split(",")),
        })
        .optional(),
    category_id: z.string().optional(),
    limit: z.coerce.number().optional().default(100),
    offset: z.coerce.number().optional().default(0),
    region_id: z.string().optional(),
    country_code: z.string().optional(),
    province: z.string().optional(),
    fields: z.string().optional(),
});

export type SearchProductsQueryParams = z.infer<typeof SearchProductsQueryParamsSchema>;

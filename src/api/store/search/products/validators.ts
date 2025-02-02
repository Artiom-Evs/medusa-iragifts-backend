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
    limit: z.coerce.number().optional(),
    offset: z.coerce.number().optional(),
    region_id: z.string().optional(),
    country_code: z.string().optional(),
    province: z.string().optional(),
    fields: z.string().optional(),
});

export type SearchProductsQueryParams = z.infer<typeof SearchProductsQueryParamsSchema>;

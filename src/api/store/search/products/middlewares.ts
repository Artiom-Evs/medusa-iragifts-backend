import {
    applyDefaultFilters,
    clearFiltersByKey,
    maybeApplyLinkFilter,
    MiddlewareRoute,
    validateAndTransformQuery,
} from "@medusajs/framework";
import { isPresent, ProductStatus } from "@medusajs/framework/utils";
import { listProductQueryConfig } from "@medusajs/medusa/api/store/products/query-config";
import {
    filterByValidSalesChannels,
    normalizeDataForContext,
    setPricingContext,
    setTaxContext,
} from "@medusajs/medusa/api/utils/middlewares/index";
import { SearchProductsQueryParamsSchema } from "./validators";

export const storeSearchProductsRoutesMiddlewares: MiddlewareRoute[] = [
    {
        method: ["GET"],
        matcher: "/store/search/products",
        middlewares: [
            validateAndTransformQuery(SearchProductsQueryParamsSchema, listProductQueryConfig),
            filterByValidSalesChannels(),
            maybeApplyLinkFilter({
                entryPoint: "product_sales_channel",
                resourceId: "product_id",
                filterableField: "sales_channel_id",
            }),
            applyDefaultFilters({
                status: ProductStatus.PUBLISHED,
                // TODO: the type here seems off and the implementation does not take into account $and and $or possible filters. Might be worth re working (original type used here was StoreGetProductsParamsType)
                categories: (filters: any, fields: string[]) => {
                    const categoryIds = filters.category_id;
                    delete filters.category_id;

                    if (!isPresent(categoryIds)) {
                        return;
                    }

                    return { id: categoryIds, is_internal: false, is_active: true };
                },
            }),
            normalizeDataForContext(),
            setPricingContext(),
            setTaxContext(),
            clearFiltersByKey(["region_id", "country_code", "province", "cart_id"]),
        ],
    },
];

import {
    ContainerRegistrationKeys,
    isPresent,
    remoteQueryObjectFromString,
} from "@medusajs/framework/utils";
import { MedusaResponse } from "@medusajs/framework/http";
import { wrapVariantsWithInventoryQuantityForSalesChannel } from "@medusajs/medusa/api/utils/middlewares/index";
import {
    RequestWithContext,
    wrapProductsWithTaxPrices,
} from "@medusajs/medusa/api/store/products/helpers";
import { HttpTypes } from "@medusajs/framework/types";
import { MEILISEARCH_MODULE, MeiliSearchService } from "src/modules/meilisearch";
import { SearchProductsQueryParams } from "./validators";

export const GET = async (
    req: RequestWithContext<HttpTypes.StoreProductListParams>,
    res: MedusaResponse<HttpTypes.StoreProductListResponse>,
) => {
    const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY);
    const searchService = req.scope.resolve<MeiliSearchService>(MEILISEARCH_MODULE);
    const productsIndex = searchService.getIndex("products");

    const { q, filter, category_id, limit, offset } =
        req.validatedQuery as SearchProductsQueryParams;

    const mFilter = Object.entries(filter ?? {}).reduce((filter, [key, values]) => {
        filter.push(values.map((v) => `option_${key} = "${v}"`).join(" OR "));
        return filter;
    }, [] as string[]);

    if (category_id) mFilter.push(`category_id = "${category_id}"`);

    const { hits, ...metadata } = await productsIndex.search<{ id: string }>(q, {
        filter: mFilter,
        limit,
        offset,
        attributesToRetrieve: ["id"],
    });

    const context: object = {};

    const withInventoryQuantity = req.queryConfig.fields.some((field) =>
        field.includes("variants.inventory_quantity"),
    );

    if (withInventoryQuantity) {
        req.queryConfig.fields = req.queryConfig.fields.filter(
            (field) => !field.includes("variants.inventory_quantity"),
        );
    }

    if (isPresent(req.pricingContext)) {
        context["variants.calculated_price"] = {
            context: req.pricingContext,
        };
    }

    const productIds = hits.map((h) => h.id);
    const queryObject = remoteQueryObjectFromString({
        entryPoint: "product",
        variables: {
            filters: {
                id: productIds,
                status: "published",
            },
            skip: 0,
            take: productIds.length,
            ...context,
        },
        fields: req.queryConfig.fields,
    });

    const { rows: products } = await remoteQuery(queryObject);

    if (withInventoryQuantity) {
        await wrapVariantsWithInventoryQuantityForSalesChannel(
            req,
            products.map((product) => product.variants).flat(1),
        );
    }

    await wrapProductsWithTaxPrices(req, products);

    res.json({
        products,
        count: metadata.estimatedTotalHits,
        offset: metadata.offset,
        limit: metadata.limit,
    });
};

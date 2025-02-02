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
import { buildSearchProductsFilter } from "./utils";

export const GET = async (
    req: RequestWithContext<HttpTypes.StoreProductListParams>,
    res: MedusaResponse<HttpTypes.StoreProductListResponse>,
) => {
    const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY);
    const searchService = req.scope.resolve<MeiliSearchService>(MEILISEARCH_MODULE);
    const productsIndex = searchService.getIndex("products");

    const { q, color, base_color, size, category_id, limit, offset } =
        req.validatedQuery as SearchProductsQueryParams;

    const filter = buildSearchProductsFilter({ category_id, color, base_color, size });
    const { hits, ...metadata } = await productsIndex.search<{ id: string }>(q, {
        filter,
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

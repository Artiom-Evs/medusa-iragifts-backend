import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { ProductEvents, SearchUtils } from "@medusajs/utils";
import { MEILISEARCH_MODULE, MeiliSearchService } from "src/modules/meilisearch";

export default async function productUpsertHandler({
    event: { data },
    container,
}: SubscriberArgs<{ id: string }>) {
    const productModuleService = container.resolve(Modules.PRODUCT);
    const meiliSearchService = container.resolve<MeiliSearchService>(MEILISEARCH_MODULE);
    const productId = data.id;

    const product = await productModuleService.retrieveProduct(productId, {
        relations: ["categories", "options", "options.values", "variants"],
    });

    await meiliSearchService.addDocuments("products", [product], SearchUtils.indexTypes.PRODUCTS);
}

export const config: SubscriberConfig = {
    event: [ProductEvents.PRODUCT_CREATED, ProductEvents.PRODUCT_UPDATED],
};

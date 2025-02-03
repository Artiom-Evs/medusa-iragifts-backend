import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { ProductEvents } from "@medusajs/utils";
import { MEILISEARCH_MODULE, MeiliSearchService } from "src/modules/meilisearch";

export default async function productDeleteHandler({
    event: { data },
    container,
}: SubscriberArgs<{ id: string }>) {
    const productId = data.id;

    const meiliSearchService = container.resolve<MeiliSearchService>(MEILISEARCH_MODULE);
    await meiliSearchService.deleteDocument("products", productId);
}

export const config: SubscriberConfig = {
    event: ProductEvents.PRODUCT_DELETED,
};

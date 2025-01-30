import { IProductModuleService, LoaderOptions } from "@medusajs/framework/types";
import { MeiliSearchService } from "../meilisearch-service";
import { MeilisearchModuleOptions } from "../types";
import { transformProduct } from "../utils";
import { Modules, SearchUtils } from "@medusajs/framework/utils";

export async function productsLoader({
    container,
    options,
    logger,
}: LoaderOptions<MeilisearchModuleOptions>): Promise<void> {
    logger?.info("Start importing products to Meilisearch index.");

    if (!options) {
        throw new Error("Missing meilisearch configuration");
    }

    const meiliSearchService: MeiliSearchService = new MeiliSearchService(container, options);
    const productsIndex = meiliSearchService.getIndex("products");
    const productsService = container.resolve<IProductModuleService>(Modules.PRODUCT);

    let page = 1;
    const limit = 1000;

    while (true) {
        const products = await productsService.listProducts(undefined, {
            relations: ["categories", "options", "options.values", "variants"],
            skip: (page++ - 1) * limit,
            take: limit,
        });

        if (products.length === 0) break;

        await meiliSearchService.addDocuments(
            "products",
            products,
            SearchUtils.indexTypes.PRODUCTS,
        );

        logger?.info(`${products.length} imported.`);
    }
}

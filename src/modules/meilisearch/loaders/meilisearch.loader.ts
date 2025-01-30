import { LoaderOptions } from "@medusajs/framework/types";
import { MeiliSearchService } from "../meilisearch-service";
import { MeilisearchModuleOptions } from "../types";

export async function MeiliSearchLoader({
    container,
    options,
    logger,
}: LoaderOptions<MeilisearchModuleOptions>): Promise<void> {
    logger?.info("Start Meilisearch initialization.");

    if (!options) {
        throw new Error("Missing meilisearch configuration");
    }

    const meiliSearchService: MeiliSearchService = new MeiliSearchService(container, options);
    const { settings } = options;

    await Promise.all(
        Object.entries(settings || {}).map(async ([indexName, value]) => {
            return await meiliSearchService.updateSettings(indexName, value);
        }),
    );
}

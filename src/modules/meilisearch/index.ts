import { Module } from "@medusajs/framework/utils";
import { MeiliSearchService } from "./meilisearch-service";
import { MeiliSearchLoader, productsLoader } from "./loaders";

export * from "./types";
export * from "./meilisearch-service";

export const MEILISEARCH_MODULE = "meilisearch";

export default Module(MEILISEARCH_MODULE, {
    service: MeiliSearchService,
    loaders: [MeiliSearchLoader, productsLoader],
});

import { Config, Settings } from "meilisearch";
import { SearchTypes } from "@medusajs/types";

export interface MeilisearchModuleOptions {
    /**
     * Meilisearch client configuration
     */
    config: Config;
    /**
     * Index settings
     */
    settings?: {
        [key: string]: SearchTypes.IndexSettings & Settings;
    };
}

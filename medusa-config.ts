import { loadEnv, defineConfig, ModuleRegistrationName, Modules } from "@medusajs/framework/utils";
import { join } from "path";
import { transformProduct } from "src/modules/meilisearch/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        redisUrl: process.env.REDIS_URL,
        http: {
            storeCors: process.env.STORE_CORS!,
            adminCors: process.env.ADMIN_CORS!,
            authCors: process.env.AUTH_CORS!,
            jwtSecret: process.env.JWT_SECRET || "supersecret",
            cookieSecret: process.env.COOKIE_SECRET || "supersecret",
        },
    },
    modules: [
        {
            resolve: "@medusajs/cache-redis",
            key: ModuleRegistrationName.CACHE,
            options: {
                redisUrl: process.env.REDIS_URL,
            },
        },
        {
            resolve: "@medusajs/event-bus-redis",
            key: ModuleRegistrationName.EVENT_BUS,
            options: {
                redisUrl: process.env.REDIS_URL,
            },
        },
        {
            resolve: "@medusajs/workflow-engine-redis",
            key: ModuleRegistrationName.WORKFLOW_ENGINE,
            options: {
                redis: {
                    url: process.env.REDIS_URL,
                },
            },
        },
        {
            resolve: join(__dirname, "src/modules/meilisearch"),
            dependencies: [Modules.PRODUCT],
            options: {
                config: {
                    host: process.env.MEILISEARCH_HOST,
                    apiKey: process.env.MEILISEARCH_API_KEY,
                },
                settings: {
                    products: {
                        indexSettings: {
                            searchableAttributes: [
                                "handle",
                                "title",
                                "description",
                                "variant_sku",
                                "variant_title",
                                "option_supplier",
                                "option_color",
                                "option_base_color",
                                "option_size",
                            ],
                            filterableAttributes: [
                                "category_id",
                                "option_supplier",
                                "option_color",
                                "option_base_color",
                                "option_size",
                            ],
                            displayedAttributes: [
                                "id",
                                "external_id",
                                "handle",
                                "title",
                                "description",
                                "thumbnail",
                                "category_id",
                                "variant_sku",
                                "variant_title",
                                "option_supplier",
                                "option_color",
                                "option_base_color",
                                "option_size",
                            ],
                        },
                        primaryKey: "id",
                        transformer: transformProduct,
                    },
                },
            },
        },
    ],
});

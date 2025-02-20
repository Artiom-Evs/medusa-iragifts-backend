import {
    loadEnv,
    defineConfig,
    ModuleRegistrationName,
    Modules,
    ContainerRegistrationKeys,
} from "@medusajs/framework/utils";
import { join, resolve } from "path";
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
            resolve: "@medusajs/medusa/locking",
            key: Modules.LOCKING,
            options: {
                providers: [
                    {
                        resolve: "@medusajs/medusa/locking-redis",
                        id: "lp_redis",
                        is_default: true,
                        options: {
                            redisUrl: process.env.REDIS_URL,
                        },
                    },
                    {
                        resolve: "@medusajs/medusa/auth-google",
                        id: "google",
                        options: {
                            clientId: process.env.GOOGLE_CLIENT_ID,
                            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                            callbackUrl: process.env.GOOGLE_CALLBACK_URL,
                        },
                    },
                ],
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
                                "supplier",
                                "color",
                                "base_color",
                                "size",
                            ],
                            filterableAttributes: [
                                "category_id",
                                "supplier",
                                "color",
                                "base_color",
                                "option_size",
                            ],
                            displayedAttributes: [
                                "id",
                                "external_id",
                                "handle",
                                "title",
                                "description",
                                "thumbnail",
                                "variant_sku",
                                "variant_title",
                                "category_id",
                                "supplier",
                                "color",
                                "base_color",
                                "size",
                            ],
                        },
                        primaryKey: "id",
                        transformer: transformProduct,
                    },
                },
            },
        },
        {
            resolve: "@medusajs/medusa/auth",
            dependencies: [Modules.CACHE, ContainerRegistrationKeys.LOGGER],
            key: Modules.AUTH,
            options: {
                providers: [
                    {
                        resolve: "@medusajs/medusa/auth-emailpass",
                        id: "emailpass",
                    },
                    {
                        resolve: "@medusajs/medusa/auth-google",
                        id: "google",
                        options: {
                            clientId: process.env.GOOGLE_CLIENT_ID,
                            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                            callbackUrl: process.env.GOOGLE_CALLBACK_URL,
                        },
                    },
                ],
            },
        },
        {
            resolve: "@medusajs/medusa/payment",
            options: {
                providers: [
                    {
                        resolve: "@medusajs/medusa/payment-stripe",
                        id: "stripe",
                        options: {
                            apiKey: process.env.STRIPE_API_KEY,
                            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
                            capture: true,
                        },
                    },
                ],
            },
        },
    ],
});

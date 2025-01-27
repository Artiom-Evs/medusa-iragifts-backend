import { loadEnv, defineConfig, ModuleRegistrationName } from '@medusajs/framework/utils';

loadEnv(process.env.NODE_ENV || 'development', process.cwd());

module.exports = defineConfig({
    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        redisUrl: process.env.REDIS_URL,
        http: {
            storeCors: process.env.STORE_CORS!,
            adminCors: process.env.ADMIN_CORS!,
            authCors: process.env.AUTH_CORS!,
            jwtSecret: process.env.JWT_SECRET || 'supersecret',
            cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
        },
    },
    modules: [
        {
            resolve: '@medusajs/cache-redis',
            key: ModuleRegistrationName.CACHE,
            options: {
                redisUrl: process.env.REDIS_URL,
            },
        },
        {
            resolve: '@medusajs/event-bus-redis',
            key: ModuleRegistrationName.EVENT_BUS,
            options: {
                redisUrl: process.env.REDIS_URL,
            },
        },
        {
            resolve: '@medusajs/workflow-engine-redis',
            key: ModuleRegistrationName.WORKFLOW_ENGINE,
            options: {
                redis: {
                    url: process.env.REDIS_URL,
                },
            },
        },
    ],
});

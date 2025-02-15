import { authenticate, MiddlewareRoute } from "@medusajs/framework";

export const authIdentityRoutesMiddlewares: MiddlewareRoute[] = [
    {
        method: ["GET"],
        matcher: "/auth/identity",
        middlewares: [
            authenticate("customer", ["session", "bearer"], {
                allowUnregistered: true,
            }),
        ],
    },
];

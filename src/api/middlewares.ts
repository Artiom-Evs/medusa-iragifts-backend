import { defineMiddlewares } from "@medusajs/framework/http";
import { storeSearchProductsRoutesMiddlewares } from "./store/search/products/middlewares";
import { authIdentityRoutesMiddlewares } from "./auth/identity/middlewares";

export default defineMiddlewares([
    ...storeSearchProductsRoutesMiddlewares,
    ...authIdentityRoutesMiddlewares,
]);

import { defineMiddlewares } from "@medusajs/framework/http";
import { storeSearchProductsRoutesMiddlewares } from "./store/search/products/middlewares";

export default defineMiddlewares([...storeSearchProductsRoutesMiddlewares]);

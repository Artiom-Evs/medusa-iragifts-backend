import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError, MedusaErrorTypes, Modules } from "@medusajs/framework/utils";

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
    const authModuleService = req.scope.resolve(Modules.AUTH);
    const filter = { auth_identity_id: req.auth_context.auth_identity_id || "" };

    const [provider_identity] = await authModuleService.listProviderIdentities(filter, { take: 1 });

    if (!provider_identity) {
        throw new MedusaError(MedusaErrorTypes.UNAUTHORIZED, "No identity found");
    }

    // provider_metadata removed from the response, because it stores password hash for users with the emilpass auth provider
    const { provider_metadata, ...identity } = provider_identity;

    res.json({ identity });
};

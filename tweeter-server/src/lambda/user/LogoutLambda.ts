import { TweeterResponse, AuthenticatedRequest } from "tweeter-shared"
import { UserService } from "../../model/services/UserService";
import { DynamoDaoFactory } from "../../model/factory/DynamoDaoFactory";

export const handler = async (request: AuthenticatedRequest): Promise<TweeterResponse> => {
    const userService: UserService = new UserService(new DynamoDaoFactory());
    await userService.logout(request.token);

    return {
        success: true,
        message: null,
    }
}
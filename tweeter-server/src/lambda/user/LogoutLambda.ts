import { TweeterResponse, AuthenticatedRequest } from "tweeter-shared"
import { UserService } from "../../model/services/UserService";

export const handler = async (request: AuthenticatedRequest): Promise<TweeterResponse> => {
    const userService: UserService = new UserService();
    await userService.logout(request.token);

    return {
        success: true,
        message: null,
    }
}
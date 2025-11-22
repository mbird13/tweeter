import { UserRequest, UserResponse } from "tweeter-shared"
import { UserService } from "../../model/services/UserService";
import { DynamoDaoFactory } from "../../model/factory/DynamoDaoFactory";

export const handler = async (request: UserRequest): Promise<UserResponse> => {
    const userService: UserService = new UserService(new DynamoDaoFactory());
    const response = await userService.getUser(request.token, request.alias);

    return {
        success: true,
        message: null,
        user: response
    }
}
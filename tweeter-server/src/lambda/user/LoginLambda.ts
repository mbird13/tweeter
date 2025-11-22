import { AuthenticationRequest, AuthenticationResponse } from "tweeter-shared"
import { UserService } from "../../model/services/UserService";
import { DynamoDaoFactory } from "../../model/factory/DynamoDaoFactory";

export const handler = async (request: AuthenticationRequest): Promise<AuthenticationResponse> => {
    const userService: UserService = new UserService(new DynamoDaoFactory());
    const response = await userService.login(request.alias, request.password);

    return {
        success: true,
        message: null,
        user: response[0],
        authToken: response[1]
    }
}
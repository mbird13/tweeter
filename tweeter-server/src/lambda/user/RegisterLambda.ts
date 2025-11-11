import { RegisterRequest, AuthenticationResponse } from "tweeter-shared"
import { UserService } from "../../model/services/UserService";

export const handler = async (request: RegisterRequest): Promise<AuthenticationResponse> => {
    const userService: UserService = new UserService();
    const response = await userService.register(request.firstName, request.lastName, request.alias, request.password, request.imageStringBase64, request.imageFileExtension);

    return {
        success: true,
        message: null,
        user: response[0],
        authToken: response[1]
    }
}
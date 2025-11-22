import { RegisterRequest, AuthenticationResponse } from "tweeter-shared"
import { UserService } from "../../model/services/UserService";
import { DynamoDaoFactory } from "../../model/factory/DynamoDaoFactory";

export const handler = async (request: RegisterRequest): Promise<AuthenticationResponse> => {
    const userService: UserService = new UserService(new DynamoDaoFactory());
    const response = await userService.register(request.firstName, request.lastName, request.alias, request.password, request.imageStringBase64, request.imageFileExtension);

    return {
        success: true,
        message: null,
        user: response[0],
        authToken: response[1]
    }
}
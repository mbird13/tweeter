import { UserDto } from "../../dto/UserDto";
import { AuthenticatedRequest } from "./AuthenticatedRequest";

export interface CountRequest extends AuthenticatedRequest {
    readonly user: UserDto
}
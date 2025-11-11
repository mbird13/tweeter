import { AuthenticatedRequest } from "./AuthenticatedRequest";

export interface UserRequest extends AuthenticatedRequest {
    readonly alias: string
}
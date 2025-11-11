import { AuthenticatedRequest } from "./AuthenticatedRequest";

export interface PostRequest<T> extends AuthenticatedRequest {
    readonly item: T
}
import { PostRequest, CountResponse, UserDto } from "tweeter-shared"
import { FollowService } from "../../model/services/FollowService"
import { DynamoDaoFactory } from "../../model/factory/DynamoDaoFactory";

export const handler = async (request: PostRequest<UserDto>): Promise<CountResponse> => {
    const followService = new FollowService(new DynamoDaoFactory());
    const response = await followService.getFolloweeCount(request.token, request.item);

    return {
        success: true,
        message: null,
        count: response
    }
}
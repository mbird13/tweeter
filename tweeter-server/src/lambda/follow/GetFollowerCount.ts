import { PostRequest, CountResponse, UserDto } from "tweeter-shared"
import { FollowService } from "../../model/services/FollowService"

export const handler = async (request: PostRequest<UserDto>): Promise<CountResponse> => {
    const followService = new FollowService();
    const response = await followService.getFollowerCount(request.token, request.item);

    return {
        success: true,
        message: null,
        count: response
    }
}
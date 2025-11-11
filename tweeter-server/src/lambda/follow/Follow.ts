import { PostRequest, FollowResponse, User, UserDto } from "tweeter-shared"
import { FollowService } from "../../model/services/FollowService"

export const handler = async (request: PostRequest<UserDto>): Promise<FollowResponse> => {
    const followService = new FollowService();
    const response = await followService.follow(request.token, request.item);

    return {
        success: true,
        message: null,
        followerCount: response[0],
        followeeCount: response[1]
    }
}
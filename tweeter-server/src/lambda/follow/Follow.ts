import { PostRequest, FollowResponse, UserDto } from "tweeter-shared"
import { FollowService } from "../../model/services/FollowService"
import { DynamoDaoFactory } from "../../model/factory/DynamoDaoFactory";

export const handler = async (request: PostRequest<UserDto>): Promise<FollowResponse> => {
    const followService = new FollowService(new DynamoDaoFactory());
    const response = await followService.follow(request.token, request.item);

    return {
        success: true,
        message: null,
        followerCount: response[0],
        followeeCount: response[1]
    }
}
import { CountRequest, FollowResponse, User } from "tweeter-shared"
import { FollowService } from "../../model/services/FollowService"

export const handler = async (request: CountRequest): Promise<FollowResponse> => {
    const followService = new FollowService();
    const user = User.fromDto(request.user);
    const response = await followService.follow(request.token, user!);

    return {
        success: true,
        message: null,
        followerCount: response[0],
        followeeCount: response[1]
    }
}
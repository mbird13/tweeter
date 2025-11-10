import { CountRequest, CountResponse, User } from "tweeter-shared"
import { FollowService } from "../../model/services/FollowService"

export const handler = async (request: CountRequest): Promise<CountResponse> => {
    const followService = new FollowService();
    const user = User.fromDto(request.user);
    const response = await followService.getFolloweeCount(request.token, user!);

    return {
        success: true,
        message: null,
        count: response
    }
}
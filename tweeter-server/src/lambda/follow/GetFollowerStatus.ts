import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared"
import { FollowService } from "../../model/services/FollowService"

export const handler = async (request: IsFollowerRequest): Promise<IsFollowerResponse> => {
    const followService = new FollowService();
    const status = await followService.getIsFollowerStatus(request.token, request.user, request.selectedUser);

    return {
        success: true,
        message: null,
        status: status
    }
}
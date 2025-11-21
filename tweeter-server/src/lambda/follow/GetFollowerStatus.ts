import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared"
import { FollowService } from "../../model/services/FollowService"
import { DynamoDaoFactory } from "../../model/factory/DynamoDaoFactory";

export const handler = async (request: IsFollowerRequest): Promise<IsFollowerResponse> => {
    const followService = new FollowService(new DynamoDaoFactory());
    const status = await followService.getIsFollowerStatus(request.token, request.user, request.selectedUser);

    return {
        success: true,
        message: null,
        status: status
    }
}
import { PostRequest, StatusDto, TweeterResponse } from "tweeter-shared"
import { StatusService } from "../../model/services/StatusService";

export const handler = async (request: PostRequest<StatusDto>): Promise<TweeterResponse> => {
    const statusService = new StatusService();
    await statusService.postStatus(request.token, request.item);

    return {
        success: true,
        message: null
    }
}
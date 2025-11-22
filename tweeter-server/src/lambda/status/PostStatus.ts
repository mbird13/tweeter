import { PostRequest, StatusDto, TweeterResponse } from "tweeter-shared"
import { StatusService } from "../../model/services/StatusService";
import { DynamoDaoFactory } from "../../model/factory/DynamoDaoFactory";

export const handler = async (request: PostRequest<StatusDto>): Promise<TweeterResponse> => {
    const statusService = new StatusService(new DynamoDaoFactory());
    await statusService.postStatus(request.token, request.item);

    return {
        success: true,
        message: null
    }
}
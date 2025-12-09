import { Follow, PostRequest, Status, StatusDto, TweeterResponse } from "tweeter-shared"
import { StatusService } from "../../model/services/StatusService";
import { DynamoDaoFactory } from "../../model/factory/DynamoDaoFactory";
import { FollowService } from "../../model/services/FollowService";
import { UpdateFeedQueue } from "../../model/daos/SQS/UpdateFeedQueue";

export const handler = async (event: any) => {
    const statusService = new StatusService(new DynamoDaoFactory());

    for (let i = 0; i < event.Records.length; ++i) {
        const { body } = event.Records[i];
        console.log(body);

        let request = JSON.parse(body);
        await statusService.batchAddFeed(request.followers, new Status(request.status._post, request.status._user, request.status._timestamp));

    }
    
    return {
        success: true,
        message: null
    }
}
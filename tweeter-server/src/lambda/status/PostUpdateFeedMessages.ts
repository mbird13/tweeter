import { Follow, PostRequest, StatusDto, TweeterResponse } from "tweeter-shared"
import { StatusService } from "../../model/services/StatusService";
import { DynamoDaoFactory } from "../../model/factory/DynamoDaoFactory";
import { FollowService } from "../../model/services/FollowService";
import { UpdateFeedQueue } from "../../model/daos/SQS/UpdateFeedQueue";

export const handler = async (event: any) => {
    const followService = new FollowService(new DynamoDaoFactory());
    const updateFeedQueue: UpdateFeedQueue = new UpdateFeedQueue();

    for (let i = 0; i < event.Records.length; ++i) {
        const { body } = event.Records[i];

        let request = JSON.parse(body);
        console.log(body);
        let followers = [];
        let hasMore = true;
        let lastItem = null;

        while (hasMore) {
            [followers, hasMore] = await followService.loadMoreFollowers(request.token, request.author._alias, 25, lastItem);
            await updateFeedQueue.addFollowersToQueue(request.status, followers);
            lastItem = followers.pop()!;
        }

    }
    
    return {
        success: true,
        message: null
    }
}
import { Follow, PostRequest, StatusDto, TweeterResponse, UserDto } from "tweeter-shared"
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
            [followers, hasMore] = await loadFollowersWithRetry(followService, request.token, request.author._alias, 15, lastItem, 10);
            await updateFeedQueue.addFollowersToQueue(request.status, followers);
            lastItem = followers.pop()!;
        }

    }
    
    return {
        success: true,
        message: null
    }
}

async function loadFollowersWithRetry(followService: FollowService, token: string, authorAlias: string, pageSize: number, lastKey: UserDto | null, maxRetries = 5): Promise<[UserDto[], boolean]> {
    let attempts = 0;
  
    while (true) {
      try {
        return await followService.loadMoreFollowers(token, authorAlias, pageSize, lastKey);
      } catch (err: any) {
        if (
          err.name === "ProvisionedThroughputExceededException" ||
          err.name === "ThrottlingException" ||
          err.name === "InternalServerError"
        ) {
          attempts++;
  
          if (attempts > maxRetries) {
            console.error("Max retry attempts hit for loading followers");
            throw err;
          }
  
          const base = 50; // 50ms
          const cap = 2000; // 2 seconds max
          const backoff = Math.min(cap, base * Math.pow(2, attempts));
          const delay = Math.random() * backoff;
  
          console.warn(
            `Follower load throttled. Attempt ${attempts}. Retrying in ${Math.round(
              delay
            )} ms`
          );
  
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          // Other errors → do not retry
          throw err;
        }
      }
    }
  }
  
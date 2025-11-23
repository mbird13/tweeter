import { Status, StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { StoryDaoInterface } from "../daos/interfaces/StoryDaoInterface";
import { FeedDaoInterface } from "../daos/interfaces/FeedDaoInterface";
import { DaoFactoryInterface } from "../factory/DaoFactoryInterface";
import { FollowDaoInterface } from "../daos/interfaces/FollowDaoInterface";

export class StatusService extends Service {

  storyDao: StoryDaoInterface;
  feedDao: FeedDaoInterface;
  followDao: FollowDaoInterface;
  
    constructor(daoFactory: DaoFactoryInterface) {
      super(daoFactory);
      this.storyDao = daoFactory.createStoryDao();
      this.feedDao = daoFactory.createFeedDao();
      this.followDao = daoFactory.createFollowDao();
    }

    public async loadMoreFeedItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
        ): Promise<[StatusDto[], boolean]> {

        await this.authenticate(token);

        const [statuses, hasMore] = await this.feedDao.getPageOfFeed(userAlias, pageSize, lastItem == null ? undefined: Status.fromDto(lastItem)!);
        return [statuses.map((status) => status.dto), hasMore]
    };
    
    public async loadMoreStoryItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
        ): Promise<[StatusDto[], boolean]> {
        await this.authenticate(token);

        const [statuses, hasMore] = await this.storyDao.getPageOfStory(userAlias, pageSize, lastItem == null ? undefined: Status.fromDto(lastItem)!);
        return [statuses.map((status) => status.dto), hasMore]
    };

    public async postStatus(
        token: string,
        newStatus: StatusDto
      ): Promise<void> {
        const currentUser = await this.authenticate(token);

        await this.storyDao.addStoryItem(Status.fromDto(newStatus)!);

        const followers = (await this.followDao.getFollowers(currentUser.alias)).map((follow) => follow.follower);
        await Promise.all(
          followers.map(follower =>
            this.feedDao.addFeedItem(follower, Status.fromDto(newStatus)!)
          )
        );
      };
}
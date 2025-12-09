import { Status, UserDto } from "tweeter-shared";

export interface FeedDaoInterface {
    getPageOfFeed(handle: string, pageSize: number, lastStatus: Status | undefined): Promise<[Status[], boolean]>;
    addFeedItem(owner_handle:string, status: Status): void;
    batchAddFeedItems(userList: UserDto[], status: Status): void;
}
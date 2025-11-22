import { FeedDaoInterface } from "../interfaces/FeedDaoInterface";
import { Status } from "tweeter-shared";
import { DynamoStatusDao } from "./DynamoStatusDao";

export class DynamoFeedDao extends DynamoStatusDao implements FeedDaoInterface {
    readonly tableName = "feeds";
    readonly handleAttr = "feed_owner_handle";
    readonly timestampAttr = "timestamp";
    readonly contentAttr = "content";
    readonly authorUserAttr = "user";

    async getPageOfFeed(handle: string, pageSize: number, lastStatus: Status | undefined): Promise<[Status[], boolean]> { 
        return await this.getPageOfStatuses(handle, pageSize, lastStatus);
    }

    async addFeedItem(owner_handle: string, status: Status) {
        await this.addStatus(owner_handle, status);
    }

}
import { StoryDaoInterface } from "../interfaces/StoryDaoInterface";
import { Status } from "tweeter-shared";
import { DynamoStatusDao } from "./DynamoStatusDao";

export class DynamoStoryDao extends DynamoStatusDao implements StoryDaoInterface {
    readonly tableName = "stories";
    readonly handleAttr = "author_handle";
    readonly timestampAttr = "timestamp";
    readonly contentAttr = "content";
    readonly authorUserAttr = "user";

    async getPageOfStory(handle: string, pageSize: number, lastStatus: Status | undefined): Promise<[Status[], boolean]> { 
        return await this.getPageOfStatuses(handle, pageSize, lastStatus);
    }

    async addStoryItem(status: Status) {
        await this.addStatus(status.user.alias, status);
    }

}
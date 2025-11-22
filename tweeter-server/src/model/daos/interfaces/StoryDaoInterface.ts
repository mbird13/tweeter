import { Status } from "tweeter-shared";

export interface StoryDaoInterface {
    getPageOfStory(handle: string, pageSize: number, lastStatus: Status | undefined): Promise<[Status[], boolean]>;
    addStoryItem(status: Status): void;
}
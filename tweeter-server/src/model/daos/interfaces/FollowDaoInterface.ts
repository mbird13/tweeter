import { Follow } from "tweeter-shared";

export interface FollowDaoInterface {

    getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<[Follow[], boolean]>;
    getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<[Follow[], boolean]>;
    createFollow(follow: Follow): void;
    deleteFollow(followerHandle: string, followeeHandle: string): void;
    getItem(follower_handle: string, followee_handle:string): Promise<Follow | undefined>;
    getFollowees(followerHandle: string): Promise<Follow[]>;
    getFollowers(followeeHandle: string): Promise<Follow[]>;
    batchCreateFollows(followeeAlias: string, followerAliasList: string[]): void;

}
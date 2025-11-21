import { AuthtokenDaoInterface } from "../daos/interfaces/AuthtokenDaoInterface";
import { FeedDaoInterface } from "../daos/interfaces/FeedDaoInterface";
import { FollowDaoInterface } from "../daos/interfaces/FollowDaoInterface";
import { UserDaoInterface } from "../daos/interfaces/UserDaoInteface";
import { StoryDaoInterface } from "../daos/interfaces/StoryDaoInterface";
import { ImageDaoInterface } from "../daos/interfaces/ImageDaoInterface";

export interface DaoFactoryInterface {
    createFollowDao(): FollowDaoInterface;
    createAuthtokenDao(): AuthtokenDaoInterface;
    createUserDao(): UserDaoInterface;
    createFeedDao(): FeedDaoInterface;
    createStoryDao(): StoryDaoInterface;
    createImageDao(): ImageDaoInterface;
}
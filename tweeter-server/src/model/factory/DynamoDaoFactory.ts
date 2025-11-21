import { DynamoAuthtokenDao } from "../daos/DynamoDB/DynamoAuthtokenDao";
import { DynamoFeedDao } from "../daos/DynamoDB/DynamoFeedDao";
import { DynamoFollowDao } from "../daos/DynamoDB/DynamoFollowDao";
import { DynamoStoryDao } from "../daos/DynamoDB/DynamoStoryDao";
import { DynamoUserDao } from "../daos/DynamoDB/DynamoUserDao";
import { AuthtokenDaoInterface } from "../daos/interfaces/AuthtokenDaoInterface";
import { FeedDaoInterface } from "../daos/interfaces/FeedDaoInterface";
import { FollowDaoInterface } from "../daos/interfaces/FollowDaoInterface";
import { ImageDaoInterface } from "../daos/interfaces/ImageDaoInterface";
import { StoryDaoInterface } from "../daos/interfaces/StoryDaoInterface";
import { UserDaoInterface } from "../daos/interfaces/UserDaoInteface";
import { S3ImageDao } from "../daos/S3/S3ImageDao";
import { DaoFactoryInterface } from "./DaoFactoryInterface";

export class DynamoDaoFactory implements DaoFactoryInterface {
    createAuthtokenDao(): AuthtokenDaoInterface {
        return new DynamoAuthtokenDao();
    }
    createUserDao(): UserDaoInterface {
        return new DynamoUserDao();
    }
    createFeedDao(): FeedDaoInterface {
        return new DynamoFeedDao();    
    }
    createStoryDao(): StoryDaoInterface {
        return new DynamoStoryDao();    
    }
    createImageDao(): ImageDaoInterface {
        return new S3ImageDao();    
    }
    createFollowDao(): FollowDaoInterface {
        return new DynamoFollowDao();
    }

    
}
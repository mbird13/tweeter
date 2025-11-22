import { UserDto, Follow } from "tweeter-shared";
import { Service } from "./Service";
import { FollowDaoInterface } from "../daos/interfaces/FollowDaoInterface";
import { DaoFactoryInterface } from "../factory/DaoFactoryInterface";

export class FollowService extends Service{

  followDao: FollowDaoInterface;

  constructor(daoFactory: DaoFactoryInterface) {
    super(daoFactory);
    this.followDao = daoFactory.createFollowDao();
  }

  public async loadMoreFollowees (
      token: string,
      userAlias: string,
      pageSize: number,
      lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {

      await this.authenticate(token);

      const [follows, hasMore] = await this.followDao.getPageOfFollowees(userAlias, pageSize, lastItem == null ? undefined: lastItem!.alias);
      const users = await this.userDao.batchGetUser(follows.map((follow) => follow.followee));
      return [users, hasMore];

    };

  public async loadMoreFollowers (
      token: string,
      userAlias: string,
      pageSize: number,
      lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
      
      await this.authenticate(token);

      const [follows, hasMore] = await this.followDao.getPageOfFollowers(userAlias, pageSize, lastItem == null ? undefined: lastItem!.alias);
      const users = await this.userDao.batchGetUser(follows.map((follow) => follow.follower));
      return [users, hasMore];    
    };  

  public async getIsFollowerStatus (
      token: string,
      user: UserDto,
      selectedUser: UserDto
    ): Promise<boolean> {

      await this.authenticate(token);

      return this.followDao.getItem(user.alias, selectedUser.alias) === undefined;
    };

  public async getFolloweeCount (
      token: string,
      user: UserDto
    ): Promise<number> {

      await this.authenticate(token);

      return (await this.followDao.getFollowees(user.alias)).length
    };

  public async getFollowerCount (
      token: string,
      user: UserDto
    ): Promise<number> {

      await this.authenticate(token);

      return (await this.followDao.getFollowers(user.alias)).length
    };

  public async follow(
      token: string,
      userToFollow: UserDto
      ): Promise<[followerCount: number, followeeCount: number]> {  

      const currentUser = await this.authenticate(token);
      //currentUser = follower, userToFollow = followee
      this.followDao.createFollow(new Follow(currentUser.alias, userToFollow.alias));

      //get new followee/r counts
      const followerCount = await this.getFollowerCount(token, userToFollow);
      const followeeCount = await this.getFolloweeCount(token, userToFollow);

      return [followerCount, followeeCount];
  };

  public async unfollow(
      token: string,
      userToUnfollow: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> { 
      const currentUser = await this.authenticate(token);

      //currentUser = follower, userToUnfollow = followee
      this.followDao.deleteFollow(currentUser.alias, userToUnfollow.alias)

      const followerCount = await this.getFollowerCount(token, userToUnfollow);
      const followeeCount = await this.getFolloweeCount(token, userToUnfollow);
  
      return [followerCount, followeeCount];
  };

    
}
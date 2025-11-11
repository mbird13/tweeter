import { AuthToken, User, FakeData } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService implements Service{
    private serverFacade: ServerFacade = new ServerFacade();

    public async loadMoreFollowees (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        const request = {token: authToken.token, userAlias: userAlias, pageSize: pageSize, lastItem: lastItem == null ? null : lastItem.dto}
        return this.serverFacade.getMoreFollowees(request); //FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
      };
  
    public async loadMoreFollowers (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        const request = {token: authToken.token, userAlias: userAlias, pageSize: pageSize, lastItem: lastItem == null ? null : lastItem.dto}
        return this.serverFacade.getMoreFollowers(request);
      };  

    public async getIsFollowerStatus (
        authToken: AuthToken,
        user: User,
        selectedUser: User
      ): Promise<boolean> {
        // TODO: Replace with the result of calling server
        const request = {token: authToken.token, user: user.dto, selectedUser: selectedUser.dto}
        return this.serverFacade.getFollowerStatus(request)
      };

    public async getFolloweeCount (
        authToken: AuthToken,
        user: User
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        const request = {token: authToken.token, user: user.dto}
        return this.serverFacade.getFolloweeCount(request);
      };

    public async getFollowerCount (
        authToken: AuthToken,
        user: User
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        const request = {token: authToken.token, user: user.dto}
        return this.serverFacade.getFollowerCount(request);
      };

    public async follow(
        authToken: AuthToken,
        userToFollow: User
        ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the follow message. Remove when connected to the server
        //await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
        const request = {token: authToken.token, user: userToFollow.dto}
        return this.serverFacade.follow(request);
    };

    public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the unfollow message. Remove when connected to the server
        //await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
        const request = {token: authToken.token, user: userToUnfollow.dto}
        return this.serverFacade.unfollow(request);
    };
}
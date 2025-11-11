import { AuthToken, Status, FakeData } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService implements Service {
    private serverFacade: ServerFacade = new ServerFacade();
    
    public async loadMoreFeedItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
        ): Promise<[Status[], boolean]>{
        const request = {token: authToken.token, userAlias: userAlias, pageSize: pageSize, lastItem: lastItem == null ? null : lastItem.dto}
        return this.serverFacade.getMoreFeedItems(request);
    };
    
    public async loadMoreStoryItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
        ): Promise<[Status[], boolean]> {
        const request = {token: authToken.token, userAlias: userAlias, pageSize: pageSize, lastItem: lastItem == null ? null : lastItem.dto}
        return this.serverFacade.getMoreStoryItems(request);
    };

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status
      ): Promise<void> {
        const request = {token: authToken.token, item: newStatus.dto}
        return this.serverFacade.post(request);
      };
}
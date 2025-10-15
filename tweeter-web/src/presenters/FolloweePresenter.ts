import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE, PagedItemView } from "./PageItemPresenter";
import { FollowService } from "../model.service/FollowService";



export class FolloweePresenter extends UserItemPresenter {

  protected service: FollowService = new FollowService();

    protected itemDescription(): string {
        return "load followees";
    }
    protected getMoreItemsMethod(authToken: AuthToken, userAlias: string): Promise<[User[], boolean]> {
        return this.service.loadMoreFollowees(authToken, userAlias, PAGE_SIZE, this.lastItem);
    }

}
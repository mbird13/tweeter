import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PageItemPresenter";



export class FollowerPresenter extends UserItemPresenter {

protected itemDescription(): string {
    return "load followers";
  }
  protected getMoreItemsMethod(authToken: AuthToken, userAlias: string): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowers(authToken, userAlias, PAGE_SIZE, this.lastItem);
  }

}
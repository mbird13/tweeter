import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { Status } from "tweeter-shared";
import { PAGE_SIZE } from "./PageItemPresenter";


export class StoryPresenter extends StatusItemPresenter {
    protected itemDescription(): string {
        return "load story items";
    }
    protected getMoreItemsMethod(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
        return this.service.loadMoreStoryItems(authToken, userAlias, PAGE_SIZE, this.lastItem);
    }
    
}
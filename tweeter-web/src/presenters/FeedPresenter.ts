import { AuthToken } from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";


const PAGE_SIZE = 10;


export class FeedPresenter extends StatusItemPresenter {
    constructor(view: StatusItemView) {
        super(view);
    }

    public async loadMoreItems (authToken: AuthToken, displayedUserAlias: string) {
        try {
          const [newItems, hasMore] = await this.service.loadMoreFeedItems(
            authToken!,
            displayedUserAlias,
            PAGE_SIZE,
            this.lastItem
          );
    
          this.hasMoreItems = hasMore;
          this.lastItem = newItems[newItems.length - 1];
          this.view.addItems(newItems);
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to load feed items because of exception: ${error}`
          );
        }
    }
}
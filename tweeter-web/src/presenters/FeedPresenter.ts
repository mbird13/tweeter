import { AuthToken } from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";


const PAGE_SIZE = 10;


export class FeedPresenter extends StatusItemPresenter {
    constructor(view: StatusItemView) {
        super(view);
    }

    public async loadMoreItems (authToken: AuthToken, displayedUserAlias: string) {
      await this.doFailureReportingOperation(async () => {
        const [newItems, hasMore] = await this.service.loadMoreFeedItems(
            authToken!,
            displayedUserAlias,
            PAGE_SIZE,
            this.lastItem
          );
    
          this.hasMoreItems = hasMore;
          this.lastItem = newItems[newItems.length - 1];
          this.view.addItems(newItems);
      }, "load feed items");
    }
}
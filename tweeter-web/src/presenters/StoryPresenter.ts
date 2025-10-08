import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

const PAGE_SIZE = 10;

export class StoryPresenter extends StatusItemPresenter {
    constructor(view: StatusItemView) {
        super(view);
    }

    public async loadMoreItems (authToken: AuthToken, displayedUserAlias: string) {
        try {
            const [newItems, hasMore] = await this.service.loadMoreStoryItems(
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
            `Failed to load story items because of exception: ${error}`
            );
        }
        };
}
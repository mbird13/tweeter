import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { View, Presenter } from "./Presenter";
import { Service } from "../model.service/Service";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View {
    addItems: (items: T[]) => void;
}

export abstract class PagedItemPresenter<T, U extends Service> extends Presenter<PagedItemView<T>> {
    private userService: UserService;
    protected service: U;
    

    private _hasMoreItems : boolean = true;
    private _lastItem : T | null= null;

    protected abstract serviceFactory(): U;

    public constructor(view: PagedItemView<T>) {
        super(view);
        this.userService = new UserService();
        this.service = this.serviceFactory();
    }

    public get hasMoreItems(): boolean {
        return this._hasMoreItems;
    }

    protected get lastItem(): T | null {
        return this._lastItem;
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    protected set lastItem(value: T | null) {
        this._lastItem = value;
    }

    reset() {
        this._lastItem = null;
        this._hasMoreItems = true;
    }

    public async getUser (
        authToken: AuthToken,
        alias: string
        ): Promise<User | null> {
        return this.userService.getUser(authToken, alias);
        };

    public async loadMoreItems (authToken: AuthToken, userAlias: string) {
          await this.doFailureReportingOperation(async () => {
             const [newItems, hasMore] = await this.getMoreItemsMethod(authToken, userAlias);
       
             this.hasMoreItems = hasMore;
             this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
             this.view.addItems(newItems);
           } , this.itemDescription());
    };

    protected abstract itemDescription(): string;

    protected abstract getMoreItemsMethod(authToken: AuthToken, userAlias: string): Promise<[T[], boolean]>;

    
}
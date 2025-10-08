import { Status, AuthToken, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { UserService } from "../model.service/UserService";


export interface StatusItemView {
    addItems: (items: Status[]) => void;
    displayErrorMessage: (message: string) => void;
}

export abstract class StatusItemPresenter {

    private _view: StatusItemView;
    protected service: StatusService;
    private userService: UserService;

    private _hasMoreItems : boolean = true;
    private _lastItem : Status | null= null;

    protected constructor(view: StatusItemView) {
        this._view = view;
        this.service = new StatusService();
        this.userService = new UserService();
    }

    public async reset() {
        this._lastItem = null;
        this._hasMoreItems = true;
    };

    public abstract loadMoreItems (authToken: AuthToken, displayedUserAlias: string) : void;

    public getUser(
        authToken: AuthToken,
        alias: string
        ): Promise<User | null> {
        return this.userService.getUser(authToken, alias);
    }


    public get hasMoreItems(): boolean {
        return this._hasMoreItems;
    }

    protected get lastItem(): Status | null {
        return this._lastItem;
    }

    protected get view(): StatusItemView {
        return this._view;
    }  

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    protected set lastItem(value: Status | null) {
        this._lastItem = value;
    }

}
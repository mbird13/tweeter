import { Status, AuthToken, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { UserService } from "../model.service/UserService";
import { View, Presenter } from "./Presenter";


export interface StatusItemView extends View {
    addItems: (items: Status[]) => void;
}

export abstract class StatusItemPresenter extends Presenter<StatusItemView> {

    protected service: StatusService;
    private userService: UserService;

    private _hasMoreItems : boolean = true;
    private _lastItem : Status | null= null;

    protected constructor(view: StatusItemView) {
        super(view);
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

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    protected set lastItem(value: Status | null) {
        this._lastItem = value;
    }

}
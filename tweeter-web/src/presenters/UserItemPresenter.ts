import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { FollowService } from "../model.service/FollowService";
import { Presenter, View } from "./Presenter";

export interface UserItemView extends View {
    addItems: (items: User[]) => void;
}

export abstract class UserItemPresenter extends Presenter<UserItemView> {
    private userService: UserService;
    protected service: FollowService;

    private _hasMoreItems : boolean = true;
    private _lastItem : User | null= null;

    protected constructor(view: UserItemView) {
        super(view);
        this.userService = new UserService();
        this.service = new FollowService();
    }

    // protected get view(): UserItemView {
    //     return this.view as UserItemView;
    // }

    public get hasMoreItems(): boolean {
        return this._hasMoreItems;
    }

    protected get lastItem(): User | null {
        return this._lastItem;
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    protected set lastItem(value: User | null) {
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

    public abstract loadMoreItems (authToken: AuthToken, userAlias: string): void;
}
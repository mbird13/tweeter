import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserItemView {
    addItems: (items: User[]) => void;
    displayErrorMessage: (message: string) => void;
}

export abstract class UserItemPresenter {
    private _view: UserItemView;
    private userService: UserService;

    private _hasMoreItems : boolean = true;
    private _lastItem : User | null= null;

    protected constructor(view: UserItemView) {
        this._view = view;
        this.userService = new UserService();
    }

    protected get view(): UserItemView {
        return this._view;
    }

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
import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model.service/UserService";

export interface AuthenticationView extends View {
    setIsLoading: (isLoading: boolean) => void;
    navigate: (path: string) => void;
    updateUserInfo: (currentUser: User, displayedUser: User, authToken: AuthToken, rememberMe: boolean) => void;
    setAlias: (value: string) => void;
    setPassword: (value: string) => void;
    setRememberMe: (value: boolean) => void;
}

export abstract class AuthenticationPresenter<V extends AuthenticationView> extends Presenter<V> {
    protected userService: UserService;
    
      protected _alias: string;
      public get alias(): string {
        return this._alias;
      }
      public set alias(value: string) {
        this.view.setAlias(value);
        this._alias = value;
      }
        protected _password: string;
      public get password(): string {
        return this._password;
      }
      public set password(value: string) {
        this.view.setPassword(value);
        this._password = value;
      }
        protected _rememberMe: boolean;
      public get rememberMe(): boolean {
        return this._rememberMe;
      }
      public set rememberMe(value: boolean) {
        this.view.setRememberMe(value);
        this._rememberMe = value;
      }
    
        public constructor(view: V) {
            super(view);
            this.userService = new UserService();
            this._rememberMe = false;
            this._alias = '';
            this._password = '';
        }
    
    protected async doAuthenticationOperation(operation: () => Promise<[User, AuthToken]>, navigation: () => void, errorMessage: string) {
        await this.doFailureReportingOperation(async () => {
            this.view.setIsLoading(true);

            const [user, authToken] = await operation();// this.userService.login(this.alias, this.password);

            this.view.updateUserInfo(user, user, authToken, this._rememberMe);

            navigation();
            }, errorMessage);
        this.view.setIsLoading(false);
    }
}
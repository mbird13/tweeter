import { User, AuthToken, FakeData } from "tweeter-shared";

export interface LoginView {
    setIsLoading: (isLoading: boolean) => void;
    navigate: (path: string) => void;
    updateUserInfo: (currentUser: User, displayedUser: User, authToken: AuthToken, rememberMe: boolean) => void;
    displayErrorMessage: (message: string) => void;
    setAlias: (value: string) => void;
    setPassword: (value: string) => void;
    setRememberMe: (value: boolean) => void;
}

export class LoginPresenter {

    private view: LoginView;

    private _alias: string;
  public get alias(): string {
    return this._alias;
  }
  public set alias(value: string) {
    this.view.setAlias(value);
    this._alias = value;
  }
    private _password: string;
  public get password(): string {
    return this._password;
  }
  public set password(value: string) {
    this.view.setPassword(value);
    this._password = value;
  }
    private _rememberMe: boolean;
  public get rememberMe(): boolean {
    return this._rememberMe;
  }
  public set rememberMe(value: boolean) {
    this.view.setRememberMe(value);
    this._rememberMe = value;
  }

    public constructor(view: LoginView) {
        this.view = view;
        this._rememberMe = false;
        this._alias = '';
        this._password = '';
    }


    public checkSubmitButtonStatus(): boolean {
        return !this._alias || !this._password;
    };

    public loginOnEnter(event: React.KeyboardEvent<HTMLElement>) {
        if (event.key == "Enter" && !this.checkSubmitButtonStatus()) {
        this.doLogin();
        }
    };

public async doLogin(originalUrl?: string) {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.login(this.alias, this.password);

      this.view.updateUserInfo(user, user, authToken, this._rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate(`/feed/${user.alias}`);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
  };

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
  };
}
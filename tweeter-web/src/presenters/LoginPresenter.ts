import { UserService } from "../model.service/UserService";
import { Presenter } from "./Presenter";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface LoginView extends AuthenticationView{
}

export class LoginPresenter extends AuthenticationPresenter<LoginView>{

  public checkSubmitButtonStatus(): boolean {
      return !this._alias || !this._password;
  };

  public loginOnEnter(event: React.KeyboardEvent<HTMLElement>) {
      if (event.key == "Enter" && !this.checkSubmitButtonStatus()) {
      this.doLogin();
      }
  };

  public async doLogin(originalUrl?: string) {
    await this.doAuthenticationOperation(async () => this.userService.login(
        this.alias,
        this.password,
      ), 
      () => {
        if (!!originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate(`/feed/${this.alias}`);
        }
      },
    "log in user")
    }
}
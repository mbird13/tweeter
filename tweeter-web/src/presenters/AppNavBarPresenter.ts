import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

interface AppNavBarView {
    displayInfoMessage: (message : string, duration : number) => string;
    displayErrorMessage: (message : string) => void;
    deleteMessage: (id : string) => void;
    clearUserInfo: () => void;
    navigate: (path : string) => void;
}

export class AppNavBarPresenter {

    private view : AppNavBarView;
    private userService : UserService;

    constructor(view : AppNavBarView) {
        this.view = view;
        this.userService = new UserService();
    }

    public async logOut(authToken : AuthToken) {
        const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);
    
        try {
          await this.userService.logout(authToken!);
    
          this.view.deleteMessage(loggingOutToastId);
          this.view.clearUserInfo();
          this.view.navigate("/login");
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to log user out because of exception: ${error}`
          );
        }
      };

}
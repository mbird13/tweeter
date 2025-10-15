import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { MessageView, Presenter } from "./Presenter";

interface AppNavBarView extends MessageView {
    clearUserInfo: () => void;
    navigate: (path : string) => void;
}

export class AppNavBarPresenter extends Presenter<AppNavBarView>{

    private userService : UserService;

    constructor(view : AppNavBarView) {
        super(view);
        this.userService = new UserService();
    }

    public async logOut(authToken : AuthToken) {
        const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

        await this.doFailureReportingOperation(async () => {
          await this.userService.logout(authToken!);
    
          this.view.deleteMessage(loggingOutToastId);
          this.view.clearUserInfo();
          this.view.navigate("/login");
        }, "log user out");
      };

}
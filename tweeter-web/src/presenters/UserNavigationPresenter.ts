import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";


export class UserNavigationPresenter {

    private userService : UserService;

    public constructor() {
        this.userService = new UserService();
    }

    public extractAlias (value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
    }

    public async getUser (
        authToken: AuthToken,
        alias: string
      ): Promise<any> {
        return this.userService.getUser(authToken, alias);
      }
}
import { AuthToken, User, FakeData } from "tweeter-shared";

export class UserService {
      public async getUser (
        authToken: AuthToken,
        alias: string
      ): Promise<User | null> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
      };


    public extractAlias (value: string): string {
      const index = value.indexOf("@");
      return value.substring(index);
    };  
}
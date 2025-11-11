import { UserDto, FakeData, AuthTokenDto } from "tweeter-shared";
import { Service } from "./Service";

export class UserService implements Service {
  public async getUser (
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    // TODO: Replace with the result of retrieving the user from the database
    const user = FakeData.instance.findUserByAlias(alias);
    return user ? user.dto : null;
  };
    
  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
    ): Promise<[UserDto, AuthTokenDto]> {

    // TODO: Replace with the result adding a user to the database
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }
    const authToken = FakeData.instance.authToken;

    return [user.dto, { token: authToken.token, timestamp: authToken.timestamp} ];
  };

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    const authToken = FakeData.instance.authToken;

    return [user.dto, { token: authToken.token, timestamp: authToken.timestamp} ];
  };

  public async logout(token: string): Promise<void> {
        await new Promise((res) => setTimeout(res, 500));
  };
}
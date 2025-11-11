import { Buffer } from "buffer";
import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class UserService implements Service {
  private serverFacade: ServerFacade = new ServerFacade();

  public async getUser (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    const request = {token: authToken.token, alias: alias}
    return this.serverFacade.getUser(request);
  };
    
  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
    ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const request = {firstName: firstName, lastName: lastName, alias: alias, password: password, imageStringBase64: imageStringBase64, imageFileExtension: imageFileExtension}
    const [user, authToken] = await this.serverFacade.register(request);

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, authToken];
  };

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const request = {alias: alias, password: password}
    const [user, authToken] = await this.serverFacade.login(request);

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, authToken];
  };

  public async logout(authToken: AuthToken): Promise<void> {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        this.serverFacade.logout({token: authToken.token});
  };
}
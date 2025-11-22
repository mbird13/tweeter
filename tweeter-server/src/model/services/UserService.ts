import { UserDto, AuthTokenDto, User, AuthToken } from "tweeter-shared";
import { Service } from "./Service";
import bcrypt from "bcryptjs";

export class UserService extends Service {
  public async getUser (
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    this.authenticate(token);

    const result = await this.userDao.getItem(alias);
    return result ? result[0].dto : null;
  };
  
  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
    ): Promise<[UserDto, AuthTokenDto]> {

    //TODO: add image to s3 HERE

    const user = new User(firstName, lastName, alias, `${alias}/img`);

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await this.userDao.addUser(user, hash);

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return this.generateAuthAndLogin(user);
  };

  private generateAuthAndLogin(user: User) {
    const auth = AuthToken.Generate();
    this.authtokenDao.addToken(auth.token, user.alias, auth.timestamp);
    return [user.dto, auth.dto] as [UserDto, AuthTokenDto];
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {

    const result = await this.userDao.getItem(alias);
    if (!result) { throw new Error("Bad Request: invalid username")}

    const [user, hash] = result!;
    const valid: boolean = bcrypt.compareSync(password, hash);

    if (!valid) {throw new Error("Bad Request: invalid password")}

    return this.generateAuthAndLogin(user);
  };

  public async logout(token: string): Promise<void> {
    await this.authtokenDao.deleteToken(token);
  };
}
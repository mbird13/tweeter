import { UserDto, AuthTokenDto, User, AuthToken } from "tweeter-shared";
import { Service } from "./Service";
import bcrypt from "bcryptjs";
import { ImageDaoInterface } from "../daos/interfaces/ImageDaoInterface";
import { DaoFactoryInterface } from "../factory/DaoFactoryInterface";

export class UserService extends Service {

  private imageDao: ImageDaoInterface;

  public constructor(daoFactory: DaoFactoryInterface) {
    super(daoFactory);
    this.imageDao = daoFactory.createImageDao();
  }

  public async getUser (
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    
    await this.authenticate(token);

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

      const existingUser = await this.userDao.getItem(alias);

      if (existingUser) {
        throw new Error("[Bad Request] Alias already taken");
      }

    const url = await this.imageDao.putImage(`${alias}.${imageFileExtension}`, imageStringBase64);

    const user = new User(firstName, lastName, alias, url);

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await this.userDao.addUser(user, hash);

    if (user === null) {
      throw new Error("[Bad Request] Invalid registration");
    }

    return await this.generateAuthAndLogin(user);
  };

  private async generateAuthAndLogin(user: User) {
    const auth = AuthToken.Generate();
    await this.authtokenDao.addToken(auth.token, user.alias, auth.timestamp);
    return [user.dto, auth.dto] as [UserDto, AuthTokenDto];
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {

    const result = await this.userDao.getItem(alias);
    if (!result) { throw new Error("[Bad Request]: invalid username")}

    const [user, hash] = result!;
    const valid: boolean = bcrypt.compareSync(password, hash);

    if (!valid) {throw new Error("[Bad Request]: invalid password")}

    return await this.generateAuthAndLogin(user);
  };

  public async logout(token: string): Promise<void> {
    await this.authtokenDao.deleteToken(token);
  };
}
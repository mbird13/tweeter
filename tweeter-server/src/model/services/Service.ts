import { User } from "tweeter-shared";
import { AuthtokenDaoInterface } from "../daos/interfaces/AuthtokenDaoInterface";
import { DaoFactoryInterface } from "../factory/DaoFactoryInterface";
import { UserDaoInterface } from "../daos/interfaces/UserDaoInteface";

export class Service {

    protected authtokenDao: AuthtokenDaoInterface;
    protected userDao: UserDaoInterface;

    constructor(daoFactory: DaoFactoryInterface) {
        this.authtokenDao = daoFactory.createAuthtokenDao();
        this.userDao = daoFactory.createUserDao();
    }
    protected async authenticate(token: string): Promise<User> {
        const item = await this.authtokenDao.getItem(token);

        if (item === undefined) {
          throw new Error("Bad Request : Invalid Authtoken");  
        }

        await this.authtokenDao.updateLastUsed(token, Date.now());

        const [user, _] = (await this.userDao.getItem(item.userHandle))!
        
        return user;
    }
}
import { User } from "tweeter-shared";
import { AuthtokenDaoInterface } from "../daos/interfaces/AuthtokenDaoInterface";
import { DaoFactoryInterface } from "../factory/DaoFactoryInterface";
import { UserDaoInterface } from "../daos/interfaces/UserDaoInteface";

const AUTHTOKEN_DURATION = process.env.AUTHTOKEN_DURATION;

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
          throw new Error("[Bad Request] : Invalid Authtoken");  
        }

        const duration = AUTHTOKEN_DURATION !== undefined
                        ? parseInt(AUTHTOKEN_DURATION)
                        : 30 * 60 * 1000;
        if (Date.now() - item.lastUsed > duration) {
            await this.authtokenDao.deleteToken(token);
            throw new Error("[Bad Request] : Expired Authtoken"); 
        }

        await this.authtokenDao.updateLastUsed(token, Date.now());

        const result = await this.userDao.getItem(item.userHandle);
        
        if (!result) {
            throw new Error("[Bad Request] : Invalid Authtoken");
        }

        const [user, _] = result!
        
        return user;
    }
}
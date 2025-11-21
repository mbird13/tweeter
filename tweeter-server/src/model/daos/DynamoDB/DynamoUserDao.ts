import { UserDto } from "tweeter-shared";
import { UserDaoInterface } from "../interfaces/UserDaoInteface";

export class DynamoUserDao implements UserDaoInterface {
    getBatchUsers(): UserDto[] {
        throw new Error("Method not implemented.");
    }

}
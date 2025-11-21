import { UserDto } from "tweeter-shared";

export interface UserDaoInterface {
  getBatchUsers(aliases: string[]): UserDto[];
    
}
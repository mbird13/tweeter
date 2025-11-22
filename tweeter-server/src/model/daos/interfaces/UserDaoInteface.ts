import { User } from "tweeter-shared";

export interface UserDaoInterface {
  getItem(userHandle: string): Promise<[User, string] | undefined>;
  batchGetUser(handles: string[]): Promise<User[]>;
  addUser(user: User, password: string): void;
    
}
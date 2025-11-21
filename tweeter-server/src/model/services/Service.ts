import { User } from "tweeter-shared";

export class Service {
    protected authenticate(token: string): User {
        return new User("first", "last", token, "url");
        //throw new Error("Bad Request : Invalid Authtoken");
    }
}
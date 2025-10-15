import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { PagedItemPresenter, PagedItemView } from "./PageItemPresenter";


export abstract class UserItemPresenter extends PagedItemPresenter<User, FollowService> {
    protected serviceFactory(): FollowService {
        return new FollowService();
    }
}
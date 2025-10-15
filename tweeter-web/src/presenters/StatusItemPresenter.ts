import { Status } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { PagedItemPresenter } from "./PageItemPresenter";


export abstract class StatusItemPresenter extends PagedItemPresenter<Status, StatusService> {

    protected serviceFactory(): StatusService {
        return new StatusService();
    }
}
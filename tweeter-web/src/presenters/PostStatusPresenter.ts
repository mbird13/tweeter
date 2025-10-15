import { Status, AuthToken, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { View, Presenter } from "./Presenter";

interface PostStatusView extends View {
    setIsLoading: (value: boolean) => void;
    displayInfoMessage: (message : string, duration : number) => string;
    deleteMessage: (id: string) => void;
    setPost : (post : string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView>{


    private statusService: StatusService;

    constructor(view : PostStatusView) {
        super(view);
        this.statusService = new StatusService();
    }
    public async submitPost(event: React.MouseEvent, post : string, currentUser : User, authToken : AuthToken) {
        event.preventDefault();
    
        var postingStatusToastId = "";

        await this.doFailureReportingOperation(async () => {
          this.view.setIsLoading(true);
          postingStatusToastId = this.view.displayInfoMessage(
            "Posting status...",
            0
          );
    
          const status = new Status(post, currentUser!, Date.now());
    
          await this.statusService.postStatus(authToken!, status);
    
          this.view.setPost("");
          this.view.displayInfoMessage("Status posted!", 2000);
        }, "post the status");
      
        this.view.deleteMessage(postingStatusToastId);
        this.view.setIsLoading(false);
      };

    
      public clearPost(event: React.MouseEvent) {
        event.preventDefault();
        this.view.setPost("");
      };
    
      public checkButtonStatus(post : string, authToken : AuthToken | null, currentUser : User | null) : boolean {
        return !post.trim() || !authToken || !currentUser;
      };
}
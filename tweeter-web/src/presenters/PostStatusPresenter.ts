import { Status, AuthToken, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";

interface PostStatusView {
    setIsLoading: (value: boolean) => void;
    displayInfoMessage: (message : string, duration : number) => string;
    displayErrorMessage: (message: string) => void;
    deleteMessage: (id: string) => void;
    setPost : (post : string) => void;
}

export class PostStatusPresenter {


    private view : PostStatusView;
    private statusService: StatusService;

    constructor(view : PostStatusView) {
        this.view = view;
        this.statusService = new StatusService();
    }
    public async submitPost(event: React.MouseEvent, post : string, currentUser : User, authToken : AuthToken) {
        event.preventDefault();
    
        var postingStatusToastId = "";
    
        try {
          this.view.setIsLoading(true);
          postingStatusToastId = this.view.displayInfoMessage(
            "Posting status...",
            0
          );
    
          const status = new Status(post, currentUser!, Date.now());
    
          await this.statusService.postStatus(authToken!, status);
    
          this.view.setPost("");
          this.view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to post the status because of exception: ${error}`
          );
        } finally {
          this.view.deleteMessage(postingStatusToastId);
          this.view.setIsLoading(false);
        }
      };

    
      public clearPost(event: React.MouseEvent) {
        event.preventDefault();
        this.view.setPost("");
      };
    
      public checkButtonStatus(post : string, authToken : AuthToken | null, currentUser : User | null) : boolean {
        return !post.trim() || !authToken || !currentUser;
      };
}
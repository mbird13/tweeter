import { User, AuthToken } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserItemView extends MessageView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => string;
    deleteMessage: (id: string) => void;
    setIsFollower: (isFollower: boolean) => void;
    setFolloweeCount: (count: number) => void;
    setFollowerCount: (count: number) => void;
    setIsLoading: (isLoading: boolean) => void;
}

export class UserInfoPresenter extends Presenter<UserItemView> {
    protected followService: FollowService;

    public constructor(view: UserItemView) {
        super(view);
        this.followService = new FollowService();
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
      ) {

        await this.doFailureReportingOperation(async () => {
          if (currentUser === displayedUser) {
            this.view.setIsFollower(false);
          } else {
            this.view.setIsFollower(await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!));
          }
        }, "determine follower status");
      };
    
    public async setNumbFollowees(
        authToken: AuthToken,
        displayedUser: User
      ) {
      await this.doFailureReportingOperation(async () => {
        this.view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
      }, "get followees count");
    };
    
    public async setNumbFollowers (
        authToken: AuthToken,
        displayedUser: User
      ) {
        await this.doFailureReportingOperation(async () => {
          this.view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
        }, "get followers count");
    };
    
    public async followDisplayedUser(
        event: React.MouseEvent, authToken: AuthToken, displayedUser: User
      ): Promise<void> {
        this.toggleFollowDisplayedUser(event, displayedUser, () => this.followService.follow(authToken, displayedUser), "Following", "follow", true);
    };
    

    
    public unfollowDisplayedUser = async (
        event: React.MouseEvent, authToken: AuthToken, displayedUser: User
      ): Promise<void> => {
        this.toggleFollowDisplayedUser(event, displayedUser, () => this.followService.unfollow(authToken, displayedUser), "Unfollowing", "unfollow", false);
    };

    private async toggleFollowDisplayedUser(event: React.MouseEvent, displayedUser: User, operation: () => Promise<[number, number]>, toastMessage: string, actionDescription: string, isFollower: boolean): Promise<void> {
      event.preventDefault();
    
        var followingUserToast = "";
        
        await this.doFailureReportingOperation(async () => {
          this.view.setIsLoading(true);
          followingUserToast = this.view.displayInfoMessage(
            `${toastMessage} ${displayedUser.name}...`,
            0
          );

          const [followerCount, followeeCount] = await operation();

          this.view.setIsFollower(isFollower);
          this.view.setFollowerCount(followerCount);
          this.view.setFolloweeCount(followeeCount);
        }, `${actionDescription} user`);

        this.view.deleteMessage(followingUserToast);
        this.view.setIsLoading(false);
    }

    
}
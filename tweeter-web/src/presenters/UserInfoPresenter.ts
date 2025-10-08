import { User, AuthToken } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";

export interface UserItemView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => string;
    deleteMessage: (id: string) => void;
    setIsFollower: (isFollower: boolean) => void;
    setFolloweeCount: (count: number) => void;
    setFollowerCount: (count: number) => void;
    setIsLoading: (isLoading: boolean) => void;
}

export class UserInfoPresenter {
    private _view: UserItemView;
    protected followService: FollowService;

    public constructor(view: UserItemView) {
        this._view = view;
        this.followService = new FollowService();
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
      ) {
        try {
          if (currentUser === displayedUser) {
            this._view.setIsFollower(false);
          } else {
            this._view.setIsFollower(await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!));
          }
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to determine follower status because of exception: ${error}`
          );
        }
      };
    
    public async setNumbFollowees(
        authToken: AuthToken,
        displayedUser: User
      ) {
        try {
          this._view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to get followees count because of exception: ${error}`
          );
        }
    };
    
    public async setNumbFollowers (
        authToken: AuthToken,
        displayedUser: User
      ) {
        try {
          this._view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to get followers count because of exception: ${error}`
          );
        }
    };
    
    public async followDisplayedUser(
        event: React.MouseEvent, authToken: AuthToken, displayedUser: User
      ): Promise<void> {
        event.preventDefault();
    
        var followingUserToast = "";
    
        try {
          this._view.setIsLoading(true);
          followingUserToast = this._view.displayInfoMessage(
            `Following ${displayedUser.name}...`,
            0
          );
    
          const [followerCount, followeeCount] = await this.followService.follow(
            authToken,
            displayedUser
          );

          this._view.setIsFollower(true);
          this._view.setFollowerCount(followerCount);
          this._view.setFolloweeCount(followeeCount);
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to follow user because of exception: ${error}`
          );
        } finally {
          this._view.deleteMessage(followingUserToast);
          this._view.setIsLoading(false);
        }
    };
    

    
    public unfollowDisplayedUser = async (
        event: React.MouseEvent, authToken: AuthToken, displayedUser: User
      ): Promise<void> => {
        event.preventDefault();
    
        var unfollowingUserToast = "";
    
        try {
          this._view.setIsLoading(true);
          unfollowingUserToast = this._view.displayInfoMessage(
            `Unfollowing ${displayedUser!.name}...`,
            0
          );
    
          const [followerCount, followeeCount] = await this.followService.unfollow(
            authToken!,
            displayedUser!
          );

          this._view.setIsFollower(false);
          this._view.setFollowerCount(followerCount);
          this._view.setFolloweeCount(followeeCount);
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to unfollow user because of exception: ${error}`
          );
        } finally {
          this._view.deleteMessage(unfollowingUserToast);
          this._view.setIsLoading(false);
        }
    };

    
}
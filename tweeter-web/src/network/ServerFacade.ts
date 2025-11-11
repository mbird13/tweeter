import {
  PostRequest,
  CountResponse,
  FollowResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  PagedItemRequest,
  PagedItemResponse,
  TweeterRequest,
  TweeterResponse,
  User,
  UserDto,
  StatusDto,
  Status,
  UserRequest,
  UserResponse,
  RegisterRequest,
  AuthenticationResponse,
  AuthToken,
  AuthenticationRequest,
  AuthenticatedRequest,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://5tazx6l5ua.execute-api.us-east-1.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  private async getListItem<T, U>(request: PagedItemRequest<T>, item: string, fromDto: (dto: T | null) => U | null): Promise<[U[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<T>,
      PagedItemResponse<T>
    >(request, `/${item}/list`);

    // Convert the Dto array returned by ClientCommunicator to a client side object array
    const items: U[] | null =
      response.success && response.items
        ? response.items.map((dto) => fromDto(dto) as U)
        : null;

    // Handle errors    
    if (response.success) {
      if (items == null) {
        throw new Error(`No ${item} items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  private async postAndHandle<RequestType extends TweeterRequest, ResponseType extends TweeterResponse>(
    request: RequestType,
    endpoint: string
  ): Promise<ResponseType> {
    const response = await this.clientCommunicator.doPost<RequestType, ResponseType>(
      request,
      endpoint
    );

    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
}

  public async getMoreFollowees(
    request: PagedItemRequest <UserDto>
  ): Promise<[User[], boolean]> {
    return this.getListItem<UserDto, User>(request, "followee", User.fromDto);
  }


  public async getMoreFollowers(
    request: PagedItemRequest <UserDto>
  ): Promise<[User[], boolean]> {
    return this.getListItem<UserDto, User>(request, "follower", User.fromDto);
  }

  public async getFollowerStatus(request: IsFollowerRequest): Promise<boolean> {
    const response = await this.postAndHandle<IsFollowerRequest, IsFollowerResponse>(
      request,
      "/follower/status"
    );
    return response.status;
  }
  public async getFolloweeCount(request: PostRequest<UserDto>): Promise<number> {
    const response = await this.postAndHandle<PostRequest<UserDto>, CountResponse>(
      request,
      "/followee/count"
    );
    return response.count;
  }

  public async getFollowerCount(request: PostRequest<UserDto>): Promise<number> {
    const response = await this.postAndHandle<PostRequest<UserDto>, CountResponse>(
      request,
      "/follower/count"
    );
    return response.count;
  }

  public async follow(
    request: PostRequest<UserDto>
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.postAndHandle<PostRequest<UserDto>, FollowResponse>(
      request,
      "/follow"
    );
    return [response.followerCount, response.followeeCount];
  }

  public async unfollow(
    request: PostRequest<UserDto>
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.postAndHandle<PostRequest<UserDto>, FollowResponse>(
      request,
      "/unfollow"
    );
    return [response.followerCount, response.followeeCount];
  }

  //Status
  public async getMoreFeedItems(
    request: PagedItemRequest <StatusDto>
  ): Promise<[Status[], boolean]> {
    return this.getListItem<StatusDto, Status>(request, "feed", Status.fromDto);
  }


  public async getMoreStoryItems(
    request: PagedItemRequest <StatusDto>
  ): Promise<[Status[], boolean]> {
    return this.getListItem<StatusDto, Status>(request, "story", Status.fromDto);
  }

  public async post(
    request: PostRequest<StatusDto>
  ): Promise<void> {
    await this.postAndHandle<PostRequest<StatusDto>, TweeterResponse>(
      request,
      "/story/post"
    );
    return;
  }

  public async getUser(request: UserRequest) : Promise<User | null> {
    const response = await this.postAndHandle<UserRequest, UserResponse>(
      request,
      "/user"
    );
    return User.fromDto(response.user);
  }

  public async register(request: RegisterRequest) : Promise<[User | null, AuthToken]> {
    const response = await this.postAndHandle<RegisterRequest, AuthenticationResponse>(
      request,
      "/auth/register"
    );
    return [User.fromDto(response.user), response.authToken];
  }

  public async login(request: AuthenticationRequest) : Promise<[User | null, AuthToken]> {
    const response = await this.postAndHandle<AuthenticationRequest, AuthenticationResponse>(
      request,
      "/auth/login"
    );
    return [User.fromDto(response.user), response.authToken];
  }

  public async logout(request: AuthenticatedRequest) : Promise<void> {
    await this.postAndHandle<AuthenticatedRequest, TweeterResponse>(
      request,
      "/auth/logout"
    );
    return;
  }

}
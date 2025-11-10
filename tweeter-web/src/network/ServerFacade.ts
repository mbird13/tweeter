import {
  IsFollowerRequest,
  IsFollowerResponse,
  PagedItemRequest,
  PagedItemResponse,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://qzcjyws4t9.execute-api.us-east-1.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getListItem<T, U>(request: PagedItemRequest<T>, item: string, fromDto: (dto: T | null) => U | null): Promise<[U[], boolean]> {
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
        throw new Error(`No ${item}s found`);
      } else {
        return [items, response.hasMore];
      }
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

  public async getFollowerStatus(
    request: IsFollowerRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, "/follower/status");

    // Convert the UserDto array returned by ClientCommunicator to a User array

    // Handle errors    
    if (response.success) {
      return response.status;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }
}
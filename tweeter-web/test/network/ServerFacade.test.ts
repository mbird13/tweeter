import "@testing-library/jest-dom";
import { AuthToken, PagedItemRequest, PostRequest, TweeterRequest, TweeterResponse, User, UserDto } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch"

describe('ServerFacade', () => {
  const serverFacade = new ServerFacade();

  const doPostSpy = jest.spyOn(
    serverFacade["clientCommunicator"],
    "doPost"
  );

  const TEST_ALIAS = `test_${Date.now()}@example`;
  const TEST_AUTHTOKEN = `token_${Date.now()}`;
  const TEST_USERDTO = {alias: TEST_ALIAS, firstName: `user_${Date.now()}`, lastName: `last_${Date.now()}`, imageUrl: `image_${Date.now()}`}
  const TEST_PAGESIZE = 5;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user and return a User and AuthToken from register()', async () => {
    // const request = {
    //     firstName: `user_${Date.now()}`, 
    //     lastName: "lastName", 
    //     imageStringBase64: "", 
    //     imageFileExtension: ".png", 
    //     alias: TEST_ALIAS, 
    //     password: "passW0rd" }

    // const [user, authToken] = await serverFacade.register(request);

    // expect(user).toBeInstanceOf(User);
    // expect(user?.alias).toBe("@allen");//request.alias);
    // expect(authToken).toBeInstanceOf(AuthToken);
    // expect(typeof authToken.token).toBe('string');
    // expect(authToken.token.length).toBeGreaterThan(0);

    // checkDoPostSpy(doPostSpy, request, /register/);
  });

  it('should return a list of Users and hasMore flag from getMoreFollowers()', async () => {
  // const request: PagedItemRequest<User> = {
  //   token: TEST_AUTHTOKEN,
  //   userAlias: "@allen",
  //   pageSize: TEST_PAGESIZE,
  //   lastItem: null
  // }

  // const [users, hasMore] = await serverFacade.getMoreFollowers(request);

  // expect(Array.isArray(users)).toBe(true);
  // expect(users[0]).toBeInstanceOf(User);
  // expect(users.length).toBeLessThanOrEqual(TEST_PAGESIZE)
  // expect(typeof hasMore).toBe('boolean');
  // expect(hasMore).toBe(true);

  // checkDoPostSpy(doPostSpy, request, /follower/);
});

it('should return count from getFolloweeCount()', async () => {
    // const request: PostRequest<UserDto> = {
    //   token: TEST_AUTHTOKEN,
    //   item: TEST_USERDTO,
    // };

    // const count = await serverFacade.getFolloweeCount(request);

    // expect(count).toBeGreaterThanOrEqual(0);
    // expect(typeof count).toBe('number');

    // checkDoPostSpy(doPostSpy, request, /followee\/count/)
  });

  it('should return count from getFollowerCount()', async () => {
    // const request: PostRequest<UserDto> = {
    //   token: TEST_AUTHTOKEN,
    //   item: TEST_USERDTO,
    // };

    // const count = await serverFacade.getFollowerCount(request);

    // expect(count).toBeGreaterThanOrEqual(0);
    // expect(typeof count).toBe('number');

    // checkDoPostSpy(doPostSpy, request, /follower\/count/);
  });




});

function checkDoPostSpy(
  doPostSpy: jest.SpyInstance<Promise<TweeterResponse>, [req: TweeterRequest | undefined, endpoint: string, headers?: Headers | undefined], any>, 
  request: TweeterRequest, 
  regex: RegExp) {
  expect(doPostSpy).toHaveBeenCalledTimes(1);
  expect(doPostSpy).toHaveBeenCalledWith(
    expect.objectContaining(request),
    expect.stringMatching(regex)
  );
}

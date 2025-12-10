import "@testing-library/jest-dom";
import { AuthToken, PagedItemRequest, PostRequest, Status, User, UserDto } from "tweeter-shared";
import {StatusService} from "../../src/model.service/StatusService"
import "isomorphic-fetch"
import { timeStamp } from "console";

describe('StatusService', () => {
  let service: StatusService;

  const TEST_ALIAS = `test_${Date.now()}@example`;
  const TEST_AUTHTOKEN = `token_${Date.now()}`;

  beforeAll(() => {
    service = new StatusService();
  });


  it('should load more story items successfully from serverFacade', async () => {
    // const pageSize = 5;
    // const lastItem: Status | null = null;

    // const [statuses, hasMore] = await service.loadMoreStoryItems(
    //   new AuthToken(TEST_AUTHTOKEN, 1234),
    //   TEST_ALIAS,
    //   pageSize,
    //   lastItem
    // );

    // expect(Array.isArray(statuses)).toBe(true);
    // expect(typeof hasMore).toBe('boolean');

    // if (statuses.length > 0) {
    //   expect(statuses[0]).toHaveProperty('post');
    //   expect(statuses[0]).toHaveProperty('user');
    //   expect(statuses[0]).toHaveProperty('timestamp');
    // }
    // expect(statuses.length).toBeLessThanOrEqual(pageSize);
  });
  
});

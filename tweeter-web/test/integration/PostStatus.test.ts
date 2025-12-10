import "@testing-library/jest-dom";

import { ServerFacade } from '../../src/network/ServerFacade';
import { PostStatusPresenter, PostStatusView } from '../../src/presenters/PostStatusPresenter';
import { instance, mock, verify } from "@typestrong/ts-mockito";
import "isomorphic-fetch"

describe("Post Status Integration Test", () => {

    let serverFacade: ServerFacade;
    let presenter: PostStatusPresenter;
    let mockedView: PostStatusView;
    let mockedViewInstance: PostStatusView;
    const mockEvent = { preventDefault: jest.fn() } as any;

    const alias = "@Casey";
    const password = "verysecurepassword";

    beforeEach(() => {
        serverFacade = new ServerFacade();

        mockedView = mock<PostStatusView>();
        mockedViewInstance = instance(mockedView);

        presenter = new PostStatusPresenter(mockedViewInstance);
    });

    test("status posting is appended to user's story", async () => {
        const [user, auth] = await serverFacade.login({alias: alias, password: password});
        expect(user).not.toBeNull();

        const postContent = `unique content ${Date.now()}`;

        await presenter.submitPost(mockEvent, postContent, user!, auth);

        verify(mockedView.displayInfoMessage("Status posted!", 2000)).once();

        const [ statuses, _ ] = await serverFacade.getMoreStoryItems({token: auth.token, userAlias: alias, pageSize: 5, lastItem: null});

        expect(statuses.length).toBeGreaterThan(0);

        const postedStatus = statuses[0];
        expect(postedStatus.post).toBe(postContent);
        expect(postedStatus.user.alias).toBe(alias);
        expect(Math.abs(postedStatus.timestamp - Date.now())).toBeLessThan(5000);
    }, 30000);
});

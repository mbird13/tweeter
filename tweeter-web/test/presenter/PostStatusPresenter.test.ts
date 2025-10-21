import { mock, instance, when, verify, anything, spy, capture } from "@typestrong/ts-mockito";
import { PostStatusPresenter } from "../../src/presenters/PostStatusPresenter";
import { PostStatusView } from "../../src/presenters/PostStatusPresenter";
import { StatusService } from "../../src/model.service/StatusService";
import { AuthToken, User, Status } from "tweeter-shared";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockStatusService: StatusService;

  const authToken: AuthToken = new AuthToken("ABC", Date.now());
  const mockUser: User = new User("first", "last", "alias", "imageUrl");
  const mockEvent = { preventDefault: jest.fn() } as any;

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    when(mockPostStatusView.displayInfoMessage(anything(), 0)).thenReturn("messageID");
    when(mockPostStatusView.displayInfoMessage(anything(), 2000)).thenReturn("postedMessageID");

    const presenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
    postStatusPresenter = instance(presenterSpy);

    mockStatusService = mock<StatusService>();
    when(presenterSpy["statusService"]).thenReturn(instance(mockStatusService));
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(mockEvent, "Hello world", mockUser, authToken);
    verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
  });

  it("calls postStatus on the status service with the correct status and auth token", async () => {
    await postStatusPresenter.submitPost(mockEvent, "Hello world", mockUser, authToken);

    verify(
      mockStatusService.postStatus(
        authToken,
        anything()
      )
    ).once();
    const [authoken, captureStatus] = capture(mockStatusService.postStatus).last();

    expect(captureStatus.post).toEqual('Hello world');
  });

  it("tells the view to clear the info message, clear the post, and display a status posted message when posting is successful", async () => {
    await postStatusPresenter.submitPost(mockEvent, "Hello world", mockUser, authToken);

    verify(mockPostStatusView.deleteMessage("messageID")).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
    verify(mockPostStatusView.displayErrorMessage(anything())).never();
  });

  it("tells the view to clear the info message and display an error message but not clear the post or display a status posted message when posting fails", async () => {
    when(mockStatusService.postStatus).thenThrow(new Error("An error occurred"));

    await postStatusPresenter.submitPost(mockEvent, "Hello world", mockUser, authToken);

    verify(mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: Error: An error occurred")).once();
    verify(mockPostStatusView.deleteMessage("messageID")).once();
    verify(mockPostStatusView.setPost("")).never();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();
  });
});

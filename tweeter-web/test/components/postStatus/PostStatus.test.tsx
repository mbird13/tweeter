import { act, render, screen } from "@testing-library/react";
import { userEvent, UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { anything, instance, mock, verify, when } from "@typestrong/ts-mockito";
import { PostStatusPresenter } from "../../../src/presenters/PostStatusPresenter"
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";
import { AuthToken, User } from "tweeter-shared";

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("PostStatus Component", () => {
  const mockUser = new User("first", "last", "alias", "imageUrl");
  const mockAuthToken = new AuthToken("ABC", Date.now());
  let mockPresenter: PostStatusPresenter;
  let mockPresenterInstance: PostStatusPresenter;

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUser,
      authToken: mockAuthToken,
    });
  });

  beforeEach(() => {
    mockPresenter = mock<PostStatusPresenter>();
    mockPresenterInstance = instance(mockPresenter);
 
  });

  it("starts with both Post Status and Clear buttons disabled", () => {
    const {postButton, clearButton} = renderPostStatus();

    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables both buttons when text field has text", async () => {
    const { user, textArea, postButton, clearButton } = renderPostStatus();
    await act(async () => {
    await user.type(textArea, "Hello World");
    });

    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables both buttons when text field is cleared", async () => {
    const { user, textArea, postButton, clearButton } = renderPostStatus();

    await act(async () => {
    await user.type(textArea, "Hello World");
    });
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await act(async () => {
    await user.clear(textArea);
    });
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenter's postStatus method with correct parameters when Post Status button is pressed", async () => {
    const { user, textArea, postButton } = renderPostStatus(mockPresenterInstance);

    await act(async () => {
    await user.type(textArea, "Posting a status!");
    await user.click(postButton);
    });

    verify(mockPresenter.submitPost(anything(), "Posting a status!", mockUser, mockAuthToken)).once();
  });
});

function renderPostStatus(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();
  render(!!presenter ? (<PostStatus presenter={presenter}/>) :(<PostStatus />));

   const textArea = screen.getByPlaceholderText("What's on your mind?");
  const postButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });

  return { user, textArea, postButton, clearButton };
}

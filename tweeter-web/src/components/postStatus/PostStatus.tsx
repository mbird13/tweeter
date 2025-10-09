import "./PostStatus.css";
import { useRef, useState } from "react";
import { AuthToken, Status } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo } from "../userInfo/UserInfoHooks";
import { PostStatusPresenter } from "../../presenters/PostStatusPresenter";

const PostStatus = () => {
  const { displayInfoMessage, displayErrorMessage, deleteMessage } = useMessageActions();
  const { currentUser, authToken } = useUserInfo();
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const presenter = useRef<PostStatusPresenter | null>(null);
  if (!presenter.current) presenter.current = new PostStatusPresenter({
    setIsLoading: setIsLoading,
    displayInfoMessage: displayInfoMessage,
    displayErrorMessage: displayErrorMessage,
    deleteMessage: deleteMessage,
    setPost : setPost
  });

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => {
            setPost(event.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          type="button"
          disabled={presenter.current!.checkButtonStatus(post, authToken, currentUser)}
          style={{ width: "8em" }}
          onClick={(e) => presenter.current!.submitPost(e, post, currentUser!, authToken!)}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <div>Post Status</div>
          )}
        </button>
        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={presenter.current!.checkButtonStatus(post, authToken, currentUser)}
          onClick={(e) => presenter.current!.clearPost(e)}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;

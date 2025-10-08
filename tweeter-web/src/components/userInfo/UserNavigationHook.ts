import { useNavigate } from "react-router-dom";
import { useUserInfo, useUserInfoActions } from "./UserInfoHooks";
import { useMessageActions } from "../toaster/MessageHooks";
import { UserNavigationPresenter } from "../../presenters/UserNavigationPresenter";


export const useUserNavigation = () => {
    const { setDisplayedUser } = useUserInfoActions();
    const { displayedUser, authToken } = useUserInfo();
    const { displayErrorMessage } = useMessageActions();
    const navigate = useNavigate();

    const presenter = new UserNavigationPresenter();
    return async (event: React.MouseEvent, featurePath: string): Promise<void> => {

        event.preventDefault();

        try {
        const alias = presenter.extractAlias(event.target.toString());

        const toUser = await presenter.getUser(authToken!, alias);

        if (toUser) {
            if (!toUser.equals(displayedUser!)) {
            setDisplayedUser(toUser);
            navigate(`${featurePath}/${toUser.alias}`);
            }
        }
        } catch (error) {
        displayErrorMessage(
            `Failed to get user because of exception: ${error}`
        );
        }
    }
};

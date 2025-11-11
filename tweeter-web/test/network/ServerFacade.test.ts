import "@testing-library/jest-dom";
import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch"

describe('ServerFacade Integration', () => {
  const serverFacade = new ServerFacade();

  const TEST_ALIAS = `test_${Date.now()}@example`;

  it('should register a new user and return a User and AuthToken', async () => {
    const request = {
        firstName: `user_${Date.now()}`, 
        lastName: "lastName", 
        imageStringBase64: "", 
        imageFileExtension: ".png", 
        alias: TEST_ALIAS, 
        password: "passW0rd" }

    const [user, authToken] = await serverFacade.register(request);

    expect(user).toBeInstanceOf(User);
    expect(user?.alias).toBe("@allen");//request.alias);
    console.log(authToken);
    expect(authToken).toBeInstanceOf(AuthToken);
    expect(typeof authToken.token).toBe('string');
    expect(authToken.token.length).toBeGreaterThan(0);
  });

    // describe("Server Facade", () => {
    // const mockUser = new User("first", "last", "alias", "imageUrl");
    // const mockAuthToken = new AuthToken("ABC", Date.now());

    // const serverFacade = new ServerFacade();

    // beforeAll(() => {
    //     (useUserInfo as jest.Mock).mockReturnValue({
    //     currentUser: mockUser,
    //     authToken: mockAuthToken,
    //     });
    // });

    // beforeEach(() => {
    
    // });

    // it("succesfully registers a new user", () => {
    //     const registerRequest = {firstName: "firstName", lastName: "lastName", imageStringBase64: "", imageFileExtension: ".png", alias: "@name", password: "passW0rd" }
    //     const response = await serverFacade.register(registerRequest);
    //     expect(response[0]?.alias).toBe("@name");
    //     expect(response[1]).toBeDefined();
    // });

    // it("enables both buttons when text field has text", async () => {
    //     const { user, textArea, postButton, clearButton } = renderPostStatus();
    //     await user.type(textArea, "Hello World");

    //     expect(postButton).toBeEnabled();
    //     expect(clearButton).toBeEnabled();
    // });

    // it("disables both buttons when text field is cleared", async () => {
    //     const { user, textArea, postButton, clearButton } = renderPostStatus();

    //     await user.type(textArea, "Hello World");
    //     expect(postButton).toBeEnabled();
    //     expect(clearButton).toBeEnabled();

    //     await user.clear(textArea);
    //     expect(postButton).toBeDisabled();
    //     expect(clearButton).toBeDisabled();
    // });


});
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { User, Status, UserDto } from "tweeter-shared";

export class UpdateFeedQueue {

    private sqsClient = new SQSClient();
    private sqs_url: string = "https://sqs.us-east-1.amazonaws.com/841162671729/UpdateFeedQueue";

    public async addFollowersToQueue(status: Status, followers: UserDto[]): Promise<void> {

        const params = {
            DelaySeconds: 10,
            MessageBody: JSON.stringify({ status: status, followers: followers }),
            QueueUrl: this.sqs_url,
        };

        try {
            const data = await this.sqsClient.send(new SendMessageCommand(params));
            console.log("Success, message sent. MessageID:", data.MessageId);
        } catch (err) {
            throw err;
        }
    }
}
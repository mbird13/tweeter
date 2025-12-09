import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { User, Status } from "tweeter-shared";

export class PostStatusQueue {

    private sqsClient = new SQSClient();
    private sqs_url: string = "https://sqs.us-east-1.amazonaws.com/841162671729/PostStatusQueue";

    public async addStatusToQueue(token: string, user: User, status: Status): Promise<void> {

        const params = {
            DelaySeconds: 10,
            MessageBody: JSON.stringify({ token: token, author: user, status: status }),
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
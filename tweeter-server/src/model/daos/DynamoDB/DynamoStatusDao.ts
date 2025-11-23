import { StoryDaoInterface } from "../interfaces/StoryDaoInterface";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Status, User } from "tweeter-shared";

export abstract class DynamoStatusDao {
    abstract tableName: string;
    abstract handleAttr: string;
    abstract timestampAttr: string;
    abstract contentAttr: string;
    abstract authorUserAttr: string;

    protected readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async getPageOfStatuses(handle: string, pageSize: number, lastStatus: Status | undefined): Promise<[Status[], boolean]> { 
        const params = {
            KeyConditionExpression: this.handleAttr + " = :han",
            ExpressionAttributeValues: {
                ":han": handle,
            },
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastStatus === undefined
                ? undefined
                : {[this.handleAttr]: lastStatus.user.alias, [this.timestampAttr]: lastStatus.timestamp},
            };

            const items: Status[] = [];
            const data = await this.client.send(new QueryCommand(params));
            const hasMorePages = data.LastEvaluatedKey !== undefined;
            data.Items?.forEach((item) => {
                const user = JSON.parse(item[this.authorUserAttr])
                items.push(new Status(
                    item[this.contentAttr],
                    new User(user._firstName, user._lastName, user._alias, user._imageUrl),
                    item[this.timestampAttr]
                
                ))
            }
            );

        return [items, hasMorePages];
    }

    async addStatus(owner_handle: string, status: Status) {
            const params = {
            TableName: this.tableName,
            Item: {
            [this.handleAttr]: owner_handle,
            [this.timestampAttr]: status.timestamp,
            [this.contentAttr]: status.post,
            [this.authorUserAttr]: JSON.stringify(status.user)
            },
        };
        const result = await this.client.send(new PutCommand(params));
    }

}
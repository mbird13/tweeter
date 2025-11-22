import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthtokenDaoInterface } from "../interfaces/AuthtokenDaoInterface";

export class DynamoAuthtokenDao implements AuthtokenDaoInterface {
    readonly tableName = "authtokens";
    readonly tokenAttr = "token";
    readonly userHandleAttr = "user_handle";
    readonly lastUsedAttr = "last_used";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async getItem(token: string) {
        const params = {
            TableName: this.tableName,
            Key: {[this.tokenAttr]: token}
        };
        const output = await this.client.send(new GetCommand(params));
        if (
            output.Item === undefined
            ) {
            return undefined;
        } else {
            return {
                token: output.Item[this.tokenAttr], 
                userHandle: output.Item[this.userHandleAttr], 
                lastUsed: output.Item[this.lastUsedAttr]
            };
        }
    }

    async addToken(token: string, userHandle: string, lastUsed: number) {
            const params = {
          TableName: this.tableName,
          Item: {
            [this.tokenAttr]: token,
            [this.userHandleAttr]: userHandle,
            [this.lastUsedAttr]: lastUsed,
          },
        };
            const result = await this.client.send(new PutCommand(params));
        }

    async deleteToken(token: string) {
        const params = {
              TableName: this.tableName,
              Key: {[this.tokenAttr]: token},
            };
            await this.client.send(new DeleteCommand(params));
    }

    async updateLastUsed(token: string, newDate: number) {
        const params = {
              TableName: this.tableName,
              Key: {[this.tokenAttr]: token},
              ExpressionAttributeValues: { ":las": newDate },
              UpdateExpression:
                "SET " +
                this.lastUsedAttr + " = :las"
            };
            await this.client.send(new UpdateCommand(params));
    }
}
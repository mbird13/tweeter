import {
  BatchGetCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User } from "tweeter-shared";
import { UserDaoInterface } from "../interfaces/UserDaoInteface";

export class DynamoUserDao implements UserDaoInterface {

    readonly tableName = "users";
    readonly handleAttr = "handle";
    readonly firstNameAttr = "first_name";
    readonly lastNameAttr = "last_name";
    readonly passwordAttr = "password";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async getItem(handle: string) {
            const params = {
                TableName: this.tableName,
                Key: {[this.handleAttr]: handle},
            };
            const output = await this.client.send(new GetCommand(params));
            if (
                output.Item === undefined
                ) {
                return undefined;
            } else {
                const tuple: [User, string] = 
                [new User( 
                    output.Item[this.firstNameAttr], 
                    output.Item[this.lastNameAttr],
                    output.Item[this.handleAttr], 
                    this.getImageUrl(output.Item[this.handleAttr])), 
                    output.Item![this.passwordAttr]];
                return tuple;
            }
    }

    private getImageUrl(handle: string): string {
        return `${handle}/img`
    }

    async addUser(user: User, password: string) {
            const params = {
          TableName: this.tableName,
          Item: {
            [this.handleAttr]: user.alias,
            [this.firstNameAttr]: user.firstName,
            [this.lastNameAttr]: user.lastName,
            [this.passwordAttr]: password,
          },
        };
        const result = await this.client.send(new PutCommand(params));
        }

    async batchGetUser(handles: string[]): Promise<User[]> {
    if (handles && handles.length > 0) {
      // Deduplicate the names (only necessary if used in cases where there can be duplicates)
      const handlesWithoutDuplicates = [...new Set(handles)];

      const keys = handlesWithoutDuplicates.map<Record<string, {}>>((handle) => ({
        [this.handleAttr]: handle,
      }));

      const params = {
        RequestItems: {
          [this.tableName]: {
            Keys: keys,
          },
        },
      };

      const result = await this.client.send(new BatchGetCommand(params));

      if (result.Responses) {
        return result.Responses[this.tableName].map<User>(
          (item) =>
            new User(
              item[this.firstNameAttr],
              item[this.lastNameAttr],
              item[this.handleAttr],
              this.getImageUrl(item[this.handleAttr])
            )
        );
      }
    }

    return [];
  }

    

}
import {
  BatchGetCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
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
    readonly ulrAttr = "ulr";
    private readonly followeeCountAttribute = "followee_count";
    private readonly followerCountAttribute = "follower_count";

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
                    output.Item[this.ulrAttr]), 
                    output.Item![this.passwordAttr]];
                return tuple;
            }
    }

    async addUser(user: User, password: string) {
            const params = {
          TableName: this.tableName,
          Item: {
            [this.handleAttr]: user.alias,
            [this.firstNameAttr]: user.firstName,
            [this.lastNameAttr]: user.lastName,
            [this.passwordAttr]: password,
            [this.ulrAttr]: user.imageUrl
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
              item[this.ulrAttr]
            )
        );
      }
    }

    return [];
  }

  async updateFollowerCount(alias: string, follower_count: number) {
          const params = {
                TableName: this.tableName,
                Key: {[this.handleAttr]: alias},
                ExpressionAttributeValues: { ":num": follower_count },
                UpdateExpression:
                  "SET " +
                  this.followerCountAttribute + " = :num"
              };
              await this.client.send(new UpdateCommand(params));
      }


  async getFollowerCount(handle: string) {
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
              if (output.Item[this.followerCountAttribute] === undefined) {
                throw new Error("not follower count");
              }
              else {
                return output.Item[this.followerCountAttribute];
              }
            }
    }

    

}
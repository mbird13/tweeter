import {
  BatchGetCommand,
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { FollowDaoInterface } from "../interfaces/FollowDaoInterface.js";
import { Follow, User } from "tweeter-shared";

export class DynamoFollowDao implements FollowDaoInterface {
    readonly tableName = "follows";
    readonly followerHandleAttr = "follower_handle";
    readonly followeeHandleAttr = "followee_handle";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<[Follow[], boolean]> { 
        const params = {
            KeyConditionExpression: this.followerHandleAttr + " = :fol",
            ExpressionAttributeValues: {
                ":fol": followerHandle,
            },
            TableName: this.tableName,
            Limit: pageSize,
            ScanIndexForward: true,
            ExclusiveStartKey:
                lastFolloweeHandle === undefined
                ? undefined
                : {
                    [this.followerHandleAttr]: followerHandle,
                    [this.followeeHandleAttr]: lastFolloweeHandle,
                    },
            };

            const items: Follow[] = [];
            const data = await this.client.send(new QueryCommand(params));
            const hasMorePages = data.LastEvaluatedKey !== undefined;
            data.Items?.forEach((item) =>
            items.push(
                new Follow(item[this.followerHandleAttr], item[this.followeeHandleAttr]))
            );

        return [items, hasMorePages];
    }

    async getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<[Follow[], boolean]> { 
        const params = {
            KeyConditionExpression: this.followeeHandleAttr + " = :fol",
            ExpressionAttributeValues: {
                ":fol": followeeHandle,
            },
            TableName: this.tableName,
            IndexName: "follows_index",
            Limit: pageSize,
            ScanIndexForward: true,
            ExclusiveStartKey:
                lastFollowerHandle === undefined
                ? undefined
                : {
                    [this.followeeHandleAttr]: followeeHandle,
                    [this.followerHandleAttr]: lastFollowerHandle,
                    },
            };

            const items: Follow[] = [];
            const data = await this.client.send(new QueryCommand(params));
            const hasMorePages = data.LastEvaluatedKey !== undefined;
            data.Items?.forEach((item) =>
            items.push(
                new Follow(item[this.followerHandleAttr], item[this.followeeHandleAttr])
            )
            );

        return [items, hasMorePages];
     }


    async getFollowers(followeeHandle: string): Promise<Follow[]> {
        const params = {
        KeyConditionExpression: "followee_handle = :fol",
        ExpressionAttributeValues: {
        ":fol": followeeHandle,
        },
        TableName: this.tableName,
        IndexName: "follows_index",
    };
        const output = await this.client.send(new QueryCommand(params));
        if (
        output.Items === undefined
        ) {
        return [];
        } else {
        let items: Follow[] = [];
        output.Items?.forEach((item) =>
            items.push(
                new Follow(
                item[this.followerHandleAttr],
                item[this.followeeHandleAttr],
                )
            )
        );
        return items;
        }
    }

    async getFollowees(followerHandle: string): Promise<Follow[]> {
        const params = {
        KeyConditionExpression: "follower_handle = :fol",
        ExpressionAttributeValues: {
        ":fol": followerHandle,
        },
        TableName: this.tableName,
    };
        const output = await this.client.send(new QueryCommand(params));
        if (
        output.Items === undefined
        ) {
        return [];
        } else {
        let items: Follow[] = [];
        output.Items?.forEach((item) =>
            items.push(
                new Follow(
                item[this.followerHandleAttr],
                item[this.followeeHandleAttr],
                )
            )
        );
        return items;
        }
    }

    async createFollow(follow: Follow) {
        const params = {
      TableName: this.tableName,
      Item: {
        [this.followerHandleAttr]: follow.follower,
        [this.followeeHandleAttr]: follow.followee,
      },
    };
    const result = await this.client.send(new PutCommand(params));
    }

    async batchCreateFollows(followeeAlias: string, followerAliasList: string[]) {
    if (followerAliasList.length == 0) {
      console.log("Zero followers to batch write");
      return;
    } else {
      const params = {
        RequestItems: {
          [this.tableName]: this.createPutFollowRequestItems(
            followeeAlias,
            followerAliasList
          ),
        },
      };

      try {
        const response = await this.client.send(new BatchWriteCommand(params));
        await this.putUnprocessedItems(response, params);
      } catch (err) {
        throw new Error(
          `Error while batch writing follows with params: ${JSON.stringify(params)} \n${err}`
        );
      }
    }
  }

    private createPutFollowRequestItems(
    followeeAlias: string,
    followerAliasList: string[]
  ) {
    return followerAliasList.map((followerAlias) =>
      this.createPutFollowRequest(followerAlias, followeeAlias)
    );
  }

  private createPutFollowRequest(followerAlias: string, followeeAlias: string) {
    const item = {
      [this.followerHandleAttr]: followerAlias,
      [this.followeeHandleAttr]: followeeAlias,
    };

    return {
      PutRequest: {
        Item: item,
      },
    };
  }

    // async updateFollow(newFollow: Follow) {
    //     const params = {
    //           TableName: this.tableName,
    //           Key: this.generateFollowKey(newFollow.followerHandle, newFollow.followeeHandle),
    //           ExpressionAttributeValues: { ":followerName": newFollow.followerName, ":followeeName": newFollow.followeeName },
    //           UpdateExpression:
    //             "SET " +
    //             this.followerNameAttr + " = :followerName, " + 
    //             this.followeeNameAttr + " = :followeeName" 
    //         };
    //         await this.client.send(new UpdateCommand(params));
    // }

    async deleteFollow(followerHandle: string, followeeHandle: string) {
        const params = {
              TableName: this.tableName,
              Key: this.generateFollowKey(followerHandle, followeeHandle),
            };
            await this.client.send(new DeleteCommand(params));
    }

    async getItem(follower_handle: string, followee_handle:string) {
        const params = {
            TableName: this.tableName,
            Key: this.generateFollowKey(follower_handle, followee_handle),
        };
        const output = await this.client.send(new GetCommand(params));
        if (
            output.Item === undefined
            ) {
            return undefined;
        } else {
            return new Follow(output.Item[this.followerHandleAttr], output.Item[this.followeeHandleAttr]);
        }
    }

    private generateFollowKey(follower_handle: string, followee_handle: string) {
        return {
        [this.followerHandleAttr]: follower_handle,
        [this.followeeHandleAttr]: followee_handle,
        };
    }

    private async putUnprocessedItems(
    resp: BatchWriteCommandOutput,
    params: BatchWriteCommandInput,
  ) {
    let delay = 10;
    let attempts = 0;

    while (
      resp.UnprocessedItems !== undefined &&
      Object.keys(resp.UnprocessedItems).length > 0
    ) {
      attempts++;

      if (attempts > 1) {
        // Pause before the next attempt
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Increase pause time for next attempt
        if (delay < 1000) {
          delay += 100;
        }
      }

      console.log(
        `Attempt ${attempts}. Processing ${
          Object.keys(resp.UnprocessedItems).length
        } unprocessed follow items.`
      );

      params.RequestItems = resp.UnprocessedItems;
      resp = await this.client.send(new BatchWriteCommand(params));
    }
  }
}

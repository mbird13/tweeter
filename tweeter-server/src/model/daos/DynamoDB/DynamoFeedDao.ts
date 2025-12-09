import { FeedDaoInterface } from "../interfaces/FeedDaoInterface";
import { Status, UserDto } from "tweeter-shared";
import { DynamoStatusDao } from "./DynamoStatusDao";
import { BatchWriteCommand, BatchWriteCommandInput, BatchWriteCommandOutput } from "@aws-sdk/lib-dynamodb";

export class DynamoFeedDao extends DynamoStatusDao implements FeedDaoInterface {
    readonly tableName = "feeds";
    readonly handleAttr = "feed_owner_handle";
    readonly timestampAttr = "timestamp";
    readonly contentAttr = "content";
    readonly authorUserAttr = "user";

    async getPageOfFeed(handle: string, pageSize: number, lastStatus: Status | undefined): Promise<[Status[], boolean]> { 
        return await this.getPageOfStatuses(handle, pageSize, lastStatus);
    }

    async addFeedItem(owner_handle: string, status: Status) {
        await this.addStatus(owner_handle, status);
    }

    async batchAddFeedItems(userList: UserDto[], status: Status) {
        if (userList.length == 0) {
          console.log("zero followers to batch write");
          return;
        }
    
        const params = {
          RequestItems: {
            [this.tableName]: this.createPutFeedRequestItems(
              userList,
              status
            ),
          },
        };
    
        try {
          const resp = await this.client.send(new BatchWriteCommand(params));
          await this.putUnprocessedItems(resp, params);
        } catch (err) {
          throw new Error(
            `Error while batch writing users with params: ${params}: \n${err}`
          );
        }
      }

    private createPutFeedRequestItems(
        userList: UserDto[],
        status: Status
    ) {
        return userList.map((user) =>
            this.createPutFeedRequest(user, status)
        );
    }

    private createPutFeedRequest(user: UserDto, status: Status) {
        const item = {
        [this.handleAttr]: user.alias,
        [this.timestampAttr]: status.timestamp,
        [this.contentAttr]: status.post,
        [this.authorUserAttr]: JSON.stringify(status.user)
        };

        return {
        PutRequest: {
            Item: item,
        },
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
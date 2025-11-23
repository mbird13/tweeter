export interface ImageDaoInterface {
    putImage(
        fileName: string,
        imageStringBase64Encoded: string
    ): Promise<string>;
}
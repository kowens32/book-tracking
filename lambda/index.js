const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { userId, bookId, title } = JSON.parse(event.body);
    const tableName = process.env.TABLE_NAME;

    const params = {
        TableName: tableName,
        Item: {
            userId: userId,
            bookId: bookId,
            title: title,
            status: 'checked-in' 
        },
    };

    await dynamoDB.put(params).promise();
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Book added Successfully' }),
    };
};
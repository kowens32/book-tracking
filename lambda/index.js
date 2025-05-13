const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { userId, bookId, title, email, loanerName, loanDate } = JSON.parse(event.body);
    const tableName = process.env.TABLE_NAME;

    const params = {
        TableName: tableName,
        Item: {
            userId: userId,
            bookId: bookId,
            title: title,
            email: email,
            loanerName: loanerName,
            loanDate: loanDate,
            status: 'checked-in' 
        },
    };

    try {
        await dynamoDB.put(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Book added successfully' }),
        };
    } catch (error) {
        console.error('Error writing to DynamoDB:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error saving data', error: error.message }),
        };
    }
};
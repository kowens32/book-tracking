const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const {  email, title, loanerName, loanDate } = JSON.parse(event.body);
    const tableName = process.env.TABLE_NAME;

    const params = {
        TableName: tableName,
        Item: {
            email: email,
            title: title,
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
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*', // Or 'http://localhost:3000' for stricter dev setup
              'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({ message: 'Book added successfully' }),
          };          
    }
};
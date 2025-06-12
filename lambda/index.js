const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid'); // optional UUID lib

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { email, title, loanerName, loanDate } = body;

    const bookID = `${title}-${Date.now()}`; // or use: uuidv4()

    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        userID: email,            // Partition Key
        bookID,                   // Sort Key
        title,
        loanerName,
        loanDate,
        status: 'checked-in',
        createdAt: new Date().toISOString(),
      },
    };

    await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
      body: JSON.stringify({ message: 'Book added successfully', bookID }),
    };
  } catch (error) {
    console.error('Error saving book:', error);

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
      body: JSON.stringify({ message: 'Failed to add book', error: error.message }),
    };
  }
};

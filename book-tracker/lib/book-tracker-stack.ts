import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class BookTrackerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'BookUserPool', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
    });

    const usersTable = new dynamodb.Table(this, 'Users', {
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
    });

    const booksTable = new dynamodb.Table(this, 'Books', {
      partitionKey: { name: 'bookId', type: dynamodb.AttributeType.STRING },
    });

    const loansTable = new dynamodb.Table(this, 'Loans', {
      partitionKey: { name: 'loanId', type: dynamodb.AttributeType.STRING },
    });
  }
}

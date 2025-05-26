import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';

export class BookLibraryStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // IAM user with permissions 
        const bookLibraryUser = new iam.User(this, 'BookLibraryUser');
        const policy = new iam.Policy(this, 'BookLibraryPolicy', {
            statements: [
                new iam.PolicyStatement({
                    actions: [
                        's3:*',
                        'dynamodb:*',
                        'lambda:*',
                        'apigateway:*',
                        'cognito-idp:*'
                    ],
                    resources: ['*']
                })
                      ]
                });
bookLibraryUser.attachInlinePolicy(policy);
    // S3 bucket for storing book images 
    const bookImagesBucket = new s3.Bucket(this, 'BookImagesBucket', {
        removalPolicy: cdk.RemovalPolicy.DESTROY, 
        autoDeleteObjects: true,
    });

    //DynamoDB table to store book data
    const booksTable = new dynamodb.Table(this, 'BooksTable', {
        partitionKey: { name: 'userID', type: dynamodb.AttributeType.STRING },
        sortKey: { name: 'bookID', type: dynamodb.AttributeType.STRING },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // Cognito User Pool 
    const userPool = new cognito.UserPool(this, 'UserPool', {
        selfSignUpEnabled: true,
        signInAliases: { email: true },
    });

    // Lambda function to process book uploads
    const bookProcessorLambda = new lambda.Function(this, 'BookProcessorLambda', {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        code: lambda.Code.fromAsset('lambda'),
        environment: {
            TABLE_NAME: booksTable.tableName,
            BUCKET_NAME: bookImagesBucket.bucketName, 
        },
        });
    
    // Grant Permissioins 
    bookImagesBucket.grantReadWrite(bookProcessorLambda);
    booksTable.grantReadData(bookProcessorLambda);
    
    //API gateway to expose endpoints
    const api = new apigateway.RestApi(this, 'BookLibraryApi', {
        restApiName: 'Book Library Service',
    });
    const booksResource = api.root.addResource('books');

    // Add POST method
    booksResource.addMethod('POST', new apigateway.LambdaIntegration(bookProcessorLambda), {
      authorizationType: apigateway.AuthorizationType.NONE,
    });
    
    // Add CORS Preflight 
    booksResource.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS, // or use ['http://localhost:3000'] in dev
      allowMethods: ['POST', 'OPTIONS'],
      allowHeaders: ['Content-Type'],
    });
    }

}
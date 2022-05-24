# aws-dynamodb-global-table

Deployment steps:
1. kms/stacks/us-east-1
2. kms/stacks/us-west-1 (replica)
3. root level (DynamoDB stack)

Current work priority:
1. kms/stacks/us-west-1 need to reference PrimaryKeyArn across region
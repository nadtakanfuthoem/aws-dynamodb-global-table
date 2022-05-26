var response = require("cfn-response");
exports.handler = function (event, context) {
  console.log("REQUEST RECEIVED:\\n", JSON.stringify(event));
  if (event.RequestType == "Delete") {
    response.send(event, context, response.SUCCESS);
    return;
  }
  var stackName = event.ResourceProperties.StackName;
  var responseData = {};
  if (stackName) {
    var aws = require("aws-sdk");
    aws.config.update({region: 'us-east-1'});
    var cfn = new aws.CloudFormation();
    cfn.describeStacks({ StackName: stackName }, function (err, data) {
      if (err) {
        responseData = { Error: "DescribeStacks call failed" };
        console.error(responseData.Error + "\\n", err);
        response.send(event, context, response.FAILED, responseData);
      } else {
        data.Stacks[0].Outputs.forEach(function (output) {
          responseData[output.OutputKey] = output.OutputValue;
        });
        response.send(event, context, response.SUCCESS, responseData);
      }
    });
  } else {
    responseData = { Error: "Stack name not specified" };
    console.log(responseData.Error);
    response.send(event, context, response.FAILED, responseData);
  }
};

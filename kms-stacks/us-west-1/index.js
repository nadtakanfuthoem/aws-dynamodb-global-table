var response = require("cfn-response");
exports.handler = function (event, context) {
  console.log("REQUEST RECEIVED:\\n", JSON.stringify(event));
  if (event.RequestType == "Delete") {
    response.send(event, context, response.SUCCESS);
    return;
  }
  var stackName = event.ResourceProperties.StackName;
  var REGION = event.ResourceProperties.Region;
	const OutputKeys = event.ResourceProperties.OutputKeys;
	console.log(OutputKeys);
  var responseData = {};
  if (stackName) {
    var aws = require("aws-sdk");
    aws.config.update({region: REGION});
    var cfn = new aws.CloudFormation();
    cfn.describeStacks({ StackName: stackName }, function (err, data) {
      if (err) {
        responseData = { Error: "DescribeStacks call failed" };
        console.error(responseData.Error + "\\n", err);
        response.send(event, context, response.FAILED, responseData);
      } else {
				console.log(JSON.stringify(data));
        data.Stacks[0].Outputs.forEach(function (output) {
					OutputKeys.filter((item) => {
						if (item === output.OutputKey) {
							responseData[output.OutputKey] = output.OutputValue;
						}
					})
        });
				if (responseData) {
					response.send(event, context, response.SUCCESS, responseData);
				} else {
					responseData = { Error: 'response is empty'};
					console.error(responseData.Error + '\\n', err);
					response.send(event, context, response.FAILED, responseData);
				}
      }
    });
  } else {
    responseData = { Error: "Stack name not specified" };
    console.log(responseData.Error);
    response.send(event, context, response.FAILED, responseData);
  }
};
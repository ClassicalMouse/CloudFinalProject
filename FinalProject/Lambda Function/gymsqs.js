/*exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
*/


var AWS = require("aws-sdk");

var TASK_QUEUE_URL = "https://sqs.us-east-1.amazonaws.com/069667187280/sqstest2";
var AWS_REGION = "us-east-1";

var sqs = new AWS.SQS({region: AWS_REGION});
var dynamodb = new AWS.DynamoDB({region: AWS_REGION});




// function deleteMessage(receiptHandle, cb) {
//   sqs.deleteMessage({
//     ReceiptHandle: receiptHandle,
//     QueueUrl: TASK_QUEUE_URL
//   }, cb);
// }

function work(task, cb) {
  console.log(task);
  // TODO implement
  cb();
}   

exports.handler = function(event, context, callback) {
    
    var params = {
         AttributeNames: [
            "SentTimestamp"
         ],
         MaxNumberOfMessages: 10,
         MessageAttributeNames: [
            "All"
         ],
         QueueUrl: TASK_QUEUE_URL,
         VisibilityTimeout: 20,
         WaitTimeSeconds: 0
        };
        
        sqs.receiveMessage(params, function(err, data) {
          if (err) {
            console.log("Receive Error", err);
          } else if (data.Messages) {
              var len = data.Messages.length;
              console.log(1,data);
              console.log(2,data.Messages);
            //   console.log(3,data.Messages[0].MessageAttributes.Location.StringValue);
            var i =0;
            for(i = 0; i<len; i++){
                // var refined = "";
                var pushup=data.Messages[i].MessageAttributes.pushup.StringValue;
                var deadlifts = data.Messages[i].MessageAttributes.deadlifts.StringValue;
                var squat = data.Messages[i].MessageAttributes.squat.StringValue;
                var pullups = data.Messages[i].MessageAttributes.pullups.StringValue;
                var benchpress = data.Messages[i].MessageAttributes.benchpress.StringValue;
                var PhoneNumber = data.Messages[i].MessageAttributes.PhoneNumber.StringValue;
                var gender = data.Messages[i].MessageAttributes.gender.StringValue;
                var firstname = data.Messages[i].MessageAttributes.firstname.StringValue;
                var height = data.Messages[i].MessageAttributes.height.StringValue;
                var weight = data.Messages[i].MessageAttributes.weight.StringValue;
                //  height = height * 0.025;
                // weight = weight * 0.45;
                var bmi = weight* 0.45 / (height* 0.025 * height* 0.025);
                // bmi=parseFloat(bmi);
                // pullups = pullups * 50;
                // curls = curls * 30;
                // pushup = pushup * 40;
                // deadlifts = deadlifts * 60;
                // squat = squat*40;
                // benchpress = benchpress*30;
                var total = pullups* 50  + deadlifts* 60 + pushup*40 +squat*40 +benchpress*30;
                // total=parseFloat(total);
                console.log(bmi);
                console.log(total);
                var dd = Date.now();
                
            work(event.Body, function(err) {
                if (err) {
                  callback(err);
                } else {
                    var d = new Date();
                //   deleteMessage(event.ReceiptHandle, callback);
                
                
                
                
                var body = "";
                
                //var yelpurl="https://api.yelp.com/v3/businesses/search";
                
                      
                         
                 var params = {
                  Item: {
                    
                    "id": {
                     S: String(data.Messages[i].MessageAttributes.firstname.StringValue)+String(data.Messages[i].MessageAttributes.PhoneNumber.StringValue)+String(d.getFullYear())+String(d.getMonth())+String(d.getDate())+String(d.getHours())+String(d.getMinutes())+String(d.getSeconds())
                    }, 
                    "pushup": {
                     N: pushup//data.Messages[i].MessageAttributes.DiningTime.StringValue
                    },
                    "deadlifts": {
                     N: deadlifts//data.Messages[i].MessageAttributes.Location.StringValue
                    },
                    "squat": {
                     N: squat//data.Messages[i].MessageAttributes.Location.StringValue
                    },
                    "pullups": {
                     N: pullups//data.Messages[i].MessageAttributes.Cuisine.StringValue
                    },
                    "benchpress": {
                     N: benchpress//data.Messages[i].MessageAttributes.benchpress.StringValue
                    },
                    "PhoneNumber": {
                     S: PhoneNumber//data.Messages[i].MessageAttributes.PhoneNumber.StringValue
                    },
                    "gender": {
                     S: gender//data.Messages[i].MessageAttributes.Numberofpeople.StringValue
                    },
                    "firstname": {
                     S: firstname//data.Messages[i].MessageAttributes.Numberofpeople.StringValue
                    },
                    "height": {
                     N: height//data.Messages[i].MessageAttributes.Numberofpeople.StringValue
                    },
                    "weight": {
                     N: weight//data.Messages[i].MessageAttributes.Numberofpeople.StringValue
                    },
                    "bmi":{
                     N: String(bmi)
                    },
                    "burn":{
                     N: String(total)
                    },
                    "timefrom":{
                        N:String(dd)
                    },
                    "timestamp":{
                        S:String(d)
                    }
                    }, 
                  ReturnConsumedCapacity: "TOTAL", 
                  TableName: "gymstats"
                 };
                 dynamodb.putItem(params, function(err, data) {
                   if (err) console.log(err, err.stack); // an error occurred
                   else     console.log(data);           // successful response
                   
                 });
              
                var AWS = require('aws-sdk');
                // Set region
                AWS.config.update({region: 'us-east-1'});
                var pn = PhoneNumber;//data.Messages[i].MessageAttributes.PhoneNumber.StringValue;
                
                
              
              
              
              
            var deleteParams = {
              QueueUrl: TASK_QUEUE_URL,
              ReceiptHandle: data.Messages[0].ReceiptHandle
            };
            sqs.deleteMessage(deleteParams, function(err, data) {
              if (err) {
                console.log("Delete Error", err);
              } else {
                console.log("Message Deleted", data);
              }
            });
                
          }//else
        });
                
            }//for
  
          
    }
  });
        
};


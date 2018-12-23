'use strict';

var SQS_QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/069667187280/sqstest2';

function close1(sessionAttributes, fulfillmentState, message,slots) {
    
        var AWS = require('aws-sdk');
        // Set the region 
        AWS.config.update({region: 'us-east-1'});
        var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
        // var d = new Date();
        // var dstring = String(d.getFullYear())+String(d.getMonth())+String(d.getDate())+String(d.getHours())+String(d.getMinutes())+String(d.getSeconds());
        var params = {
         DelaySeconds: 10,
         MessageAttributes: {
          "pushup": {
            DataType: "Number",
            StringValue: slots.pushup
          },
        //   "curls": {
        //     DataType: "Number",
        //     StringValue: slots.curls
        //   },
          "deadlifts": {
            DataType: "Number",
            StringValue: slots.deadlifts
          },
          "squat": {
            DataType: "Number",
            StringValue: slots.squat
          },
          "pullups": {
            DataType: "Number",
            StringValue: slots.pullups
          },
          "benchpress": {
            DataType: "Number",
            StringValue: slots.benchpress
          },
          "PhoneNumber": {
            DataType: "String",
            StringValue: slots.PhoneNumber
          },
          "gender": {
            DataType: "String",
            StringValue: slots.gender
          },
          "firstname": {
            DataType: "String",
            StringValue: slots.firstname
          },
          "height": {
            DataType: "Number",
            StringValue: slots.height
          },
          "weight": {
            DataType: "Number",
            StringValue: slots.weight
          }
        //   ,"idplus":{
        //       DataType: "String",
        //       StringValue: dstring

        //   }
         },
         MessageBody: "This is an entry.",
         QueueUrl: SQS_QUEUE_URL
        };
        console.log(params);
        sqs.sendMessage(params, function(err, data) {
          if (err) {
            console.log("Error", err);
          } else {
            console.log("Success", data.MessageId);
          }
        });
    
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}

function close(sessionAttributes, fulfillmentState, message,slots) {
    
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}
// --------------- Events -----------------------
 
function dispatch(intentRequest, callback) {
    console.log(`request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
    if(intentRequest.currentIntent.name == "ExerciseDetails"){
        const sessionAttributes = intentRequest.sessionAttributes;
        const slots = intentRequest.currentIntent.slots;
        var pushup = slots.pushup;
        var curls = slots.curls;
        var deadlifts = slots.deadlifts;
        var pullups = slots.pullups;
        var PhoneNumber = slots.PhoneNumber;
        var gender = slots.gender;
        var firstname = slots.firstname;
        var height = slots.height;
        var weight = slots.weight;
        var benchpress = slots.benchpress;
        var squat = slots.squat;
        height = height * 0.025;
        weight = weight * 0.45;
        var BMI = weight / (height * height);
        pullups = pullups * 50;
        curls = curls * 30;
        pushup = pushup * 40;
        deadlifts = deadlifts * 60;
        squat = squat*40;
        benchpress = benchpress*30;
        var total = pullups + /*curls + */deadlifts + pushup +squat +benchpress;
        callback(close1(sessionAttributes, 'Fulfilled',
        {
            'contentType': 'PlainText', 
            'content': `Okay, Your BMI is ${BMI}. You have burnt ${total} calories today.`
            
        },slots));
    
        
    }else if(intentRequest.currentIntent.name == "GreetingIntent"){
        const sessionAttributes = intentRequest.sessionAttributes;
        callback(close(sessionAttributes, 'Fulfilled',
        {'contentType': 'PlainText', 'content': `Greetings! How did your today's workout go?`}));
    
        
    }else{
        const sessionAttributes = intentRequest.sessionAttributes;
        callback(close(sessionAttributes, 'Fulfilled',
        {'contentType': 'PlainText', 'content': `Sorry, I don't understand. Would you be more specific?`}));
    }
}
// --------------- Main handler -----------------------
 
// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.

exports.handler = (event, context, callback) => {
    try {
        dispatch(event,
            (response) => {
                callback(null, response);
            });
    } catch (err) {
        callback(err);
    }
};
var AWS = require("aws-sdk");
var AWS_REGION = "us-east-1";
var dynamodb = new AWS.DynamoDB({region: AWS_REGION});

function mergeSort(arr){
   var len = arr.length;
   if(len <2)
      return arr;
   var mid = Math.floor(len/2),
       left = arr.slice(0,mid),
       right =arr.slice(mid);
   //send left and right to the mergeSort to broke it down into pieces
   //then merge those
   return merge(mergeSort(left),mergeSort(right));
}
function merge(left, right){
  var result = [],
      lLen = left.length,
      rLen = right.length,
      l = 0,
      r = 0;
  while(l < lLen && r < rLen){
     if(left[l].timefrom < right[r].timefrom){
       result.push(left[l++]);
     }
     else{
       result.push(right[r++]);
    }
  }  
  //remaining part needs to be addred to the result
  return result.concat(left.slice(l)).concat(right.slice(r));
}

exports.handler = function(event, context, callback) {
  var AWS = require('aws-sdk');
  AWS.config.update({region:'us-east-1'});
 
  console.log(event.flag);
  
  if(event.flag == "1"){
      var params = {
        botAlias: 'gymbot', /* required */
        botName: 'Gymbot', /* required */
        inputText: event.sending, /* required */
        userId: "12345", /* required */
        requestAttributes: {
          //'<String>': 'STRING_VALUE',
          /* '<String>': ... */
        },
        sessionAttributes: {
          //'<String>': 'STRING_VALUE',
          /* '<String>': ... */
        }
      };
      var lexruntime = new AWS.LexRuntime({apiVersion: '2016-11-28'});
      lexruntime.postText(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
        //console.log(data.slots);
        
        callback(null, {
            "greeting": data.message
        }); 
      });
  }else if(event.flag == "2"){
    var refined = "";
  
  var d = new Date();
  //   deleteMessage(event.ReceiptHandle, callback);
  
  var body = "";
  
  var apikey = "UPkEGRvz2SGnUqUrf9SRUcLYFndkXjYYa4yWVBXGVmIkOn890kbiyjGv6RQpyElFLaAin84C0uWlgQt5E0CoaKRFiYZD1lneR9A1BTzhwDQA_8_pGJx_M9uo_lTyW3Yx";
  
  const https = require('https');
  var promise1 = new Promise((resolve, reject) => {
    const options = {
      host: "api.yelp.com",
      path: "/v3/businesses/search?latitude="+event.latitude+"&longitude="+event.longitude+"&term=gyms",
      port: 443,
      method: 'GET',
      headers: {
        'Authorization': "Bearer "+apikey
      }
    };
    https.get(options, (res) => {
      var { statusCode } = res;
      var contentType = res.headers['content-type'];
    
      let error;
      
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +`Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content-type.\n' +`Expected application/json but received ${contentType}`);
      }
      
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
      }
      
      res.setEncoding('utf8');
      var rawData = '';
      
      res.on('data', (chunk) => {
        rawData += chunk;
      });
    
      res.on('end', () => {
        try {
          body = JSON.parse(rawData);
          // var r = Math.floor(Math.random()*18);//console.log(r);
          // refined = JSON.stringify(body.businesses[r]);
          
          // console.log(body);
          
          //body = JSON.stringify(body);
          //console.log(body);
          console.log(body.businesses.length);
          for(var i =0; i<2; i++){
            console.log(body.businesses[i]);
          }
          
          
          
          
          resolve(body);//(JSON.stringify(body)).substring(0,50)
          
          
          console.log(refined);
        } catch (e) {
          reject(e.message);
        }
      });
    }).on('error', (e) => {
      reject(`Got error: ${e.message}`);
    });
  
  });
  
  promise1.then(function(refined){          
    callback(null,{
      refined,
      "greeting":"succeed"
    })
  });//then
    // callback(null, {
    //     "greeting": event.latitude
    // }); 
  }else if(event.flag == "3"){
    var usrname = event.sendname;
    var usrpn = event.sendpn;
    var AWS = require("aws-sdk");

    AWS.config.update({
      region: "us-east-1",
    //   endpoint: "http://localhost:8000"
    });

  var params1 = {
      TableName: "gymstats",
      // ProjectionExpression: "#S, PhoneNumber,height, weight,burn,bmi,timefrom,timestamp",
      FilterExpression: "#S = :fn AND #s2 = :pn",
      ExpressionAttributeNames: {
          "#S": "firstname",
          "#s2":"PhoneNumber"
      },
      ExpressionAttributeValues: {
           ":fn": usrname,
           ":pn":usrpn
          
      }
  };
  var docClient = new AWS.DynamoDB.DocumentClient();
  console.log("Scanning Movies table.");
  docClient.scan(params1, onScan);
  
  function onScan(err, data) {
      if (err) {
          console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          // print all the movies
          console.log("Scan succeeded.");
          data.Items.forEach(function(record) {
             console.log(
                  record.id + ": ",
                  record.PhoneNumber, " - ", record.height, " - ", record.weight, " - ", record.burn, " - ", record.bmi,"-",record.timestamp);
            
          });
          
          data.Items = mergeSort(data.Items);
          
          console.log(data);
          callback(null,{
              data,
              "greeting":"DynamoDB query succeeded"
            })
          // continue scanning if we have more movies, because
          // scan can retrieve a maximum of 1MB of data
          if (typeof data.LastEvaluatedKey != "undefined") {
              console.log("Scanning for more...");
              params.ExclusiveStartKey = data.LastEvaluatedKey;
              docClient.scan(params, onScan);
          }
          
      }
  }
  }else{
    console.log(event);
    callback(null,{
      "greeting":"Not correct service!"
    })
  }
};
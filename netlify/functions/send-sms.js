/* ============================================================
   netlify/functions/send-sms.js
   Runs securely on Netlify server
   Twilio credentials stored as environment variables
============================================================ */

const https = require('https');

exports.handler = async function(event) {

  /* Handle CORS preflight */
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    var data       = JSON.parse(event.body);
    var accountSid = process.env.TWILIO_ACCOUNT_SID;
    var authToken  = process.env.TWILIO_AUTH_TOKEN;
    var fromNumber = process.env.TWILIO_FROM_NUMBER;
    var ownerPhone = process.env.OWNER_PHONE;

    var message =
      'NEW BOOKING - RABUS HAIR BRAIDS\n' +
      'Name:  ' + data.name  + '\n' +
      'Phone: ' + data.phone + '\n' +
      'Style: ' + data.style + '\n' +
      'Date:  ' + data.date  + '\n' +
      'Time:  ' + data.time  + '\n' +
      'Notes: ' + (data.notes || 'None');

    var result = await sendSMS(accountSid, authToken, fromNumber, ownerPhone, message);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ success: true, sid: result.sid })
    };

  } catch(err) {
    console.error('SMS error:', err);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};

function sendSMS(accountSid, authToken, from, to, body) {
  return new Promise(function(resolve, reject) {
    var postData = new URLSearchParams({ To: to, From: from, Body: body }).toString();
    var auth     = Buffer.from(accountSid + ':' + authToken).toString('base64');
    var options  = {
      hostname: 'api.twilio.com',
      path:     '/2010-04-01/Accounts/' + accountSid + '/Messages.json',
      method:   'POST',
      headers: {
        'Authorization':  'Basic ' + auth,
        'Content-Type':   'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    var req = https.request(options, function(res) {
      var body = '';
      res.on('data', function(chunk) { body += chunk; });
      res.on('end', function() {
        var parsed = JSON.parse(body);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(parsed);
        } else {
          reject(new Error(parsed.message || 'Twilio error ' + res.statusCode));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

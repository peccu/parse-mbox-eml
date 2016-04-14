'use strict';
var MailParser = require('mailparser').MailParser;
var fs = require('fs');

var mailparser = new MailParser({streamAttachments : true});

mailparser.on('attachment', function(attachment, mail){
  var file = mail.messageId + '_' + attachment.generatedFileName;
  // console.log('attachment saved to ', file);
  var output = fs.createWriteStream(file);
  attachment.stream.pipe(output);
});

mailparser.on('end', function(mail){
  var headers = mail.headers;
  console.log('From   :', headers.from);
  console.log('To     :', headers.to);
  console.log('Date   :', headers.date);
  console.log('Subject:', headers.subject, '\n');
  if(mail.text){
    console.log('Body: ', mail.text);
  }
});

var eml = process.argv[2];
fs.createReadStream(eml).pipe(mailparser);

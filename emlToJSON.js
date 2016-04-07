'use strict';
var MailParser  = require('mailparser').MailParser;
var fs = require('fs');

var mailparser = new MailParser({streamAttachments : true});

mailparser.on('attachment', function(attachment, mail){
  var file = mail.messageId + '_' + attachment.generatedFileName;
  // console.log('attachment saved to ', file);
  var output = fs.createWriteStream(file);
  attachment.stream.pipe(output);
});

mailparser.on('end', function(mail){
  console.log(JSON.stringify(mail));
});

var eml = process.argv[2];
fs.createReadStream(eml).pipe(mailparser);

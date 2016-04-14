'use strict';
var MailParser = require('mailparser').MailParser;
var Mbox = require('node-mbox');
var fs = require('fs');

var mboxfile = process.argv[2];
var mailbox = fs.readFileSync(mboxfile);
var mbox = new Mbox(mailbox);

// wait for message events
mbox.on('message', function(msg){
  // parse message using MailParser
  var mailparser = new MailParser({streamAttachments : true});
  mailparser.write(msg);
  mailparser.end();

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
});

// pipe stdin to mbox parser
// process.stdin.pipe(mbox);

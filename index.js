var co = require('co');
var prompt = require('co-prompt');
var multiline = prompt.multiline;

var program = require('commander');

co(function *(){
  var first = yield prompt('first name: ');
  var last = yield prompt('last name: ');
  console.log('hello %s %s\n', first, last);

  var desc = yield multiline('description:');
  console.log('you describe yourself as:');
  console.log(desc);


  var password = yield prompt.password("Password: ");
  console.log(password);

  process.stdin.pause();
})();
const bcrypt = require('bcryptjs');

bcrypt.hash("helloworld",12).then(password => console.log(password));
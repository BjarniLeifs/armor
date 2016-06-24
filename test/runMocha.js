var exit = process.exit;
process.exit = function (code) {
  setTimeout(function () {
      exit();
  }, 200);
};

require('../app');
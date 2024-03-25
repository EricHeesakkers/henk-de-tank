const Controller = require('./controller');
const process = require('process');

async function run() {
  const controller = new Controller();
  await controller.bootstrap();

  try {
    controller.tick();
  } catch (e) {
    console.log('Error encountered, exiting!', e);
    process.exit();
  }
}

run();

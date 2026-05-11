const localtunnel = require('localtunnel');

(async () => {
  const tunnel = await localtunnel({ port: 3000 });
  console.log('your url is:', tunnel.url);

  tunnel.on('close', () => {
    console.log('tunnel closed');
    process.exit();
  });

  // Keep the process alive
  setInterval(() => {}, 1000);
})();

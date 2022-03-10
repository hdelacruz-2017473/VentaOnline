  'use strict'

  const app = require('./configs/app');
  const mongoConfig = require ('./configs/mongoConfig');
  const port = 3000;

  mongoConfig.init();

  app.listen(port, ()=>{
      console.log(`Server http running in port ${port}`);
  });  
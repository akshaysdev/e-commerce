const CronJob = require('cron').CronJob;

const { deliveryService } = require('../service/service');

/* This is a cron job that runs every 10 minutes. */
const assignDeliveryPartnerJob = new CronJob('*/10 * * * *', async function () {
  try {
    await deliveryService.autoAssignDeliveryPartners();
  } catch (error) {
    console.log(error);
  }
});

module.exports = { assignDeliveryPartnerJob };

import cron from 'node-cron'
import { deleteOldFiles } from '../helpers';




// delete old files every 30 minutes
cron.schedule("*/30 * * * *", async () => {
  console.log("⏱  Deleting old files!");
  deleteOldFiles();
  console.log("✅ Old files deleted!");
});

console.log("Cron Job started!");

export default cron;

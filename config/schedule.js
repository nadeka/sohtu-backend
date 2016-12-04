var schedule = require('node-schedule');
var sendgrid = require('../services/sendgrid');

//How many hours before the scheduled time will campaigns be sent to Sendgrid
//You also need to edit the cron below as well as the sendCampaignIfScheduleIsNear
//function in the email campaigns controller
const hours = 24;

//Now the campaigns are sent at 3 am
var j = schedule.scheduleJob('* * 3 * *', function(){
    sendgrid.sendEmailCampaigns(hours);
});

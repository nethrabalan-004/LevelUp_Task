const cron = require('node-cron');
const Task = require('../models/Task');

const startScheduler = () => {
    // Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log('Running daily task maintenance...');

        try {
            const today = new Date();

            // Find tasks that are 'working' and passed their end date
            const result = await Task.updateMany(
                {
                    status: 'working',
                    endDate: { $lt: today }
                },
                {
                    $set: { status: 'unfinished' }
                }
            );

            console.log(`Updated ${result.modifiedCount} tasks to 'unfinished'.`);
        } catch (error) {
            console.error('Error in daily task maintenance:', error);
        }
    });

    console.log('Scheduler started.');
};

module.exports = startScheduler;

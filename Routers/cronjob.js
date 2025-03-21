const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { subDays, startOfDay, endOfDay } = require('date-fns');
const connectionRequestModel = require('../Models/connectionRequests'); 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

cron.schedule('53 22 * * *', async () => { 
  try {
    const yesterday = subDays(new Date(), 0);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await connectionRequestModel.find({
      status: 'interested',
      createdAt: { 
        $gte: yesterdayStart, 
        $lte: yesterdayEnd 
      },
    }).populate('fromUserId toUserId');

    const listOfEmails = [...new Set(pendingRequests.map(req => req.toUserId.emailId))];

    for (const email of listOfEmails) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'New Connection Requests',
        text: 'You have received new connection requests on Devtinder. Visit your dashboard at ijjurouthu.duckdns.org to review and accept them now!',
        html:`
          <p>You have received <b>new connection requests</b> on <b>Devtinder</b>! 🎉</p>
          <p>Don't miss out—<a href="http://ijjurouthu.duckdns.org" style="color: #007bff; text-decoration: none;">click here</a> to review and accept them now.</p>
          <p>Happy connecting! 🤝</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${email}`);
    }
  } catch (err) {
    console.error('Error sending emails:', err);
  }
});


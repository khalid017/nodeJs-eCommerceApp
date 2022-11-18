const Mailjet = require('node-mailjet');

const mailjet = new Mailjet({
    apiKey: "689aaba6f3bbfb5e9dfea93011c9ae3b",
    apiSecret: "75ae59e809ae8af426577e27a4e76549"
  });


module.exports = async function send(username,email,body,subject)
{
  await mailjet
  .post('send', { version: 'v3.1' })
  .request({
    Messages: [
      {
        From: {
          Email: "mohd.khalid@ssipmt.com",
          Name: "Yenpai"
        },
        To: [
          {
            Email:email,
            Name: username
          }
        ],
        Subject: subject,
        // TextPart: "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
        HTMLPart: body
      }
    ]
  })

// request
// .then((result) => {
//   console.log(result.body)
// })
// .catch((err) => {
//   console.log(err.statusCode)
// })

}
  
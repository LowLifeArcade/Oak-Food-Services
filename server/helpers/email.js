exports.registerEmailParams = (email, token) => {
  // send email
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
              <html>
              <h1>Verify Email</h1>
              <p>Use the link to verify your email</p>
              <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
              </html>
              `,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Complete your registration',
      },
    },
  };
};

exports.forgotPasswordEmailParams = (email, token) => {
  // send email
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
              <html>
              <h1>Reset Password Link</h1>
              <p>Please use the link to reset your password:</p>
              <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
              </html>
              `,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Password Reset Link',
      },
    },
  };
};
// ${data.egories.map((c) => {
// }).join('---------------')}
{
  /* <img src="${data.image.url}" alt="${data.name}" style"height:50px" /> */
}

exports.linkPublishedParams = (email, data, token) => {
  // send email
  return {
    Source: process.env.EMAIL_FROM, // change to business email in .env
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
          <html>
          <h1>New Weeks Menu | Oakfoods </h1> 
          <p>A new menu <b>${data.name}</b> has just been posted! Check it out and submit your request at least two weeks in advance.</p>
          
          <h2>${data.name}</h2>
          <div>
              ${data.content}
              </div>
             <div>
              <h3><a href="${process.env.CLIENT_URL}/links/${data.slug} ">Check it out here!</a></h3>
             </div>
            
          
          <br/>
          <p>Don't want notifications? <a href=${process.env.CLIENT_URL}/user/profile/update>Click Here</a> </p>
          <p>Or turn off notifications by going to <b>dashboard</b> > <b>updated profile</b> and <b>uncheck the categories</b> </p>
          </html>
          `,
        },
      }, // add ${week} of some kind to h1
      // ADD a feature where the admin can modify this email or populate it as they configure the menu post to go up
      Subject: {
        Charset: 'UTF-8',
        Data: 'New Menu Published',
      },
    },
  };
};

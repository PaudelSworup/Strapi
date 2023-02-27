module.exports = ({ env }) => ({
    // ...
    email: {
      provider: 'mailtrap',
      providerOptions: {
        user: env('SMTP_USER', 'default_user'),
        password: env('SMTP_PASSWORD', 'default_pass')
      },
      settings: {
        defaultFrom: env('MAIL_FROM', 'default@value.com'),
        defaultReplyTo: env('MAIL_TO', 'default@value.com'),
      },
    }
    // ...
  });
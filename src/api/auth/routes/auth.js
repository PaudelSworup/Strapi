module.exports = {
     routes: [
      {
        method: 'POST',
        path: '/users/register',
        handler: 'auth.registerUser',
        config: {
          policies: []
        },
      },
    ]
}
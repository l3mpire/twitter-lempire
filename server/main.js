// https://lempire.meteorapp.com/

import cron from 'node-cron';

Meteor.publish('users', () => {
  return Meteor.users.find({}, { fields: {
    'services.twitter.screenName': 1,
    'services.twitter.profile_image_url_https': 1,
    'profile': 1,
  } });
});

Meteor.methods({
  forceUpdate() {
    updateTwitterBanner(true);
    // updateTwitterName();
  },
  send() {
    updateTwitterBanner(true);
  },
});

Meteor.startup(() => {
  updateTwitterBanner();

  // // every 10mn, ping the server
  // cron.schedule('*/10 * * * *', Meteor.bindEnvironment(() => {
  //   HTTP.get('https://lempire.meteorapp.com/');
  // }));

  // // every 10mn, update name of users
  // cron.schedule('*/10 * * * *', Meteor.bindEnvironment(updateTwitterName));

  // // every 1mn, update banner
  // cron.schedule('* * * * *', Meteor.bindEnvironment(updateTwitterBanner));
});

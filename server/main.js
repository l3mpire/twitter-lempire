import cron from 'node-cron';

Accounts.onCreateUser((options, user) => {
  user.profile = options.profile;
  user.profile.canvas = defaultBanner;
  user.profile.canvas.objects[user.profile.canvas.objects.length - 1].text = `Hi, I'm ${user.profile.name}!`;
  return user;
});

Meteor.publish('users', () => Meteor.users.find({}, { fields: {
  'services.twitter.screenName': 1,
  'services.twitter.profile_image_url_https': 1,
  profile: 1,
} }));

Meteor.methods({
  save() { updateTwitterBanner(this.userId); },
});

Meteor.startup(() => {
  updateTwitterBanner();

  // // every 10mn, update name of users
  // cron.schedule('*/10 * * * *', Meteor.bindEnvironment(updateTwitterName));

  // every 1mn, update banner
  cron.schedule('* * * * *', Meteor.bindEnvironment(() => {
    Meteor.users.find({ 'profile.disable': { $exists: false } }).forEach(user => {
      updateTwitterFollowers(user._id);
    });
  }));
});

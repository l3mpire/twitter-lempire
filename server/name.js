import Twitter from 'twitter';

updateTwitterName = () => {
    const config = Accounts.loginServiceConfiguration.findOne({ service: 'twitter' });
  
    const dayOfYear = moment().dayOfYear();
    const lastDayOfYear = moment().endOf('year').dayOfYear();
  
    const progress = parseInt(dayOfYear * 100 / lastDayOfYear);
    
    Meteor.users.find({ 'profile.disable': { $exists: false } }).forEach(user => {
      console.log('update user', user.services.twitter.screenName);
  
      var client = new Twitter({
        consumer_key: config.consumerKey,
        consumer_secret: config.secret,
        access_token_key: user.services.twitter.accessToken,
        access_token_secret: user.services.twitter.accessTokenSecret,
      });
  
      // remove old name extension
      const name = user.profile.name.replace(/ \d+\/\d+ \(\d+%\)/g, '');
  
      if (name !== user.profile.name) Meteor.users.update(user._id, { $set: { 'profile.name': name } });
  
      // update new name
      client.post('account/update_profile', {
        name: `${name} ${dayOfYear}/${lastDayOfYear} (${progress}%)`
      }, function(err, res) {
        console.log(err);
        console.log(res);
      });
    });
  };

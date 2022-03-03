import Twitter from 'twitter';
// import fs from 'fs';
import { fabric } from 'fabric';

updateTwitterFollowers = userId => {
  const config = Accounts.loginServiceConfiguration.findOne({ service: 'twitter' });

  const user = Meteor.users.findOne(userId);
  if (!user) return;

  console.log('update followers', user.services.twitter.screenName);

  const client = new Twitter({
    consumer_key: config.consumerKey,
    consumer_secret: config.secret,
    access_token_key: user.services.twitter.accessToken,
    access_token_secret: user.services.twitter.accessTokenSecret,
  });

  // get 5 latest followers
  const res = Promise.await(client.get('followers/list', { user_id: user.services.twitter.id, count: 5 }));
  if (!res || !res.users || !res.users.length) return;

  const followers = res.users;

  if (_.difference(_.pluck(user.followers || [], 'profile_image_url_https'), _.pluck(followers, 'profile_image_url_https')).length === 0) return;

  Meteor.users.update(userId, { $set: { followers } });

  updateTwitterBanner(userId);
};

updateTwitterBanner = userId => {
  const config = Accounts.loginServiceConfiguration.findOne({ service: 'twitter' });

  const user = Meteor.users.findOne(userId);
  if (!user) return;

  console.log('update banner', user.services.twitter.screenName);

  const client = new Twitter({
    consumer_key: config.consumerKey,
    consumer_secret: config.secret,
    access_token_key: user.services.twitter.accessToken,
    access_token_secret: user.services.twitter.accessTokenSecret,
  });

  const { followers } = user;

  const canvas = new fabric.StaticCanvas();
  canvas.setWidth(1500);
  canvas.setHeight(500);

  const loadFromJSON = (c, cb) => { canvas.loadFromJSON(c, () => { cb(undefined, true); }); };
  const loadFromJSONSync = Meteor.wrapAsync(loadFromJSON);

  loadFromJSONSync(user.profile.canvas);

  const fabricImageFromURL = (url, cb) => { fabric.Image.fromURL(url, image => { cb(undefined, image); }); };
  const fabricImageFromURLSync = Meteor.wrapAsync(fabricImageFromURL);

  const object = user.profile.canvas.objects.find(o => o.type === 'rect');

  if (followers) {
    for (let i = 0; i < followers.length; i++) {
      const image = fabricImageFromURLSync(followers[i].profile_image_url_https);

      image.set({
        left: object.left + i * ((object.width * object.scaleX - 48) / (followers.length - 1)),
        top: object.top,
        clipPath: new fabric.Circle({ radius: 24, originX: 'center', originY: 'center' }),
      });

      canvas.add(image);
    }
  }

  // console.log(canvas.toObject());

  const dataUrl = canvas.toDataURL({ format: 'jpeg', quality: 0.99 });
  const banner = dataUrl.replace(/^data:image\/jpeg;base64,/, '');

  canvas.clear();
  canvas.dispose();

  // fs.writeFileSync('/tmp/banner.jpg', banner, 'base64');

  Promise.await(client.post('account/update_profile_banner', { banner }));
};

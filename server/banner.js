import Twitter from 'twitter';
import fs from 'fs';
import { fabric } from 'fabric';

const latestFollowerUsers = {};

// TODO: faire un repo github
// TODO: eslint
// TODO: avoir un vrai serveur de deploy et setup ensemble
// TODO: update only the banner of the userId in parameters
// TODO: canvas object special qui est remplacé par les followers
// TODO: un cron qui get les followers et sauve dans la db et si la liste change, appelle une render

updateTwitterBanner = (force = false) => {
  const config = Accounts.loginServiceConfiguration.findOne({ service: 'twitter' });

  Meteor.users.find({ 'profile.disable': { $exists: false } }).forEach(user => {
    console.log('update user', user.services.twitter.screenName);

    const client = new Twitter({
      consumer_key: config.consumerKey,
      consumer_secret: config.secret,
      access_token_key: user.services.twitter.accessToken,
      access_token_secret: user.services.twitter.accessTokenSecret,
    });

    // get 5 latest followers
    // const res = Promise.await(client.get('followers/list', { user_id: user.services.twitter.id, count: 5 }));

    const res = {
      users: [
        {
          id: 1286933803932561400,
          id_str: '1286933803932561408',
          name: 'webeurwww',
          screen_name: 'webeurwww',
          location: 'Nantes, France',
          description: 'j’héberge mes sites web ici 👉 https://t.co/YDERVvbfph',
          url: null,
          entities: [Object],
          protected: false,
          followers_count: 26,
          friends_count: 397,
          listed_count: 0,
          created_at: 'Sat Jul 25 07:58:40 +0000 2020',
          favourites_count: 237,
          utc_offset: null,
          time_zone: null,
          geo_enabled: false,
          verified: false,
          statuses_count: 126,
          lang: null,
          status: [Object],
          contributors_enabled: false,
          is_translator: false,
          is_translation_enabled: false,
          profile_background_color: 'F5F8FA',
          profile_background_image_url: null,
          profile_background_image_url_https: null,
          profile_background_tile: false,
          profile_image_url: 'http://pbs.twimg.com/profile_images/1460671214507200517/ISNEbhur_normal.jpg',
          profile_image_url_https: 'https://pbs.twimg.com/profile_images/1460671214507200517/ISNEbhur_normal.jpg',
          profile_link_color: '1DA1F2',
          profile_sidebar_border_color: 'C0DEED',
          profile_sidebar_fill_color: 'DDEEF6',
          profile_text_color: '333333',
          profile_use_background_image: true,
          has_extended_profile: true,
          default_profile: true,
          default_profile_image: false,
          following: false,
          live_following: false,
          follow_request_sent: false,
          notifications: false,
          muting: false,
          blocking: false,
          blocked_by: false,
          translator_type: 'none',
          withheld_in_countries: []
        },
        {
          id: 935113614113103900,
          id_str: '935113614113103873',
          name: 'Guillaume Buttiens',
          screen_name: 'glmbtns',
          location: '',
          description: '',
          url: null,
          entities: [Object],
          protected: false,
          followers_count: 3,
          friends_count: 141,
          listed_count: 0,
          created_at: 'Mon Nov 27 11:50:33 +0000 2017',
          favourites_count: 116,
          utc_offset: null,
          time_zone: null,
          geo_enabled: false,
          verified: false,
          statuses_count: 28,
          lang: null,
          status: [Object],
          contributors_enabled: false,
          is_translator: false,
          is_translation_enabled: false,
          profile_background_color: 'F5F8FA',
          profile_background_image_url: null,
          profile_background_image_url_https: null,
          profile_background_tile: false,
          profile_image_url: 'http://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
          profile_image_url_https: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
          profile_link_color: '1DA1F2',
          profile_sidebar_border_color: 'C0DEED',
          profile_sidebar_fill_color: 'DDEEF6',
          profile_text_color: '333333',
          profile_use_background_image: true,
          has_extended_profile: false,
          default_profile: true,
          default_profile_image: true,
          following: false,
          live_following: false,
          follow_request_sent: false,
          notifications: false,
          muting: false,
          blocking: false,
          blocked_by: false,
          translator_type: 'none',
          withheld_in_countries: []
        },
        {
          id: 1486637371462348800,
          id_str: '1486637371462348800',
          name: 'Joisa Cato',
          screen_name: 'joisaggc',
          location: '',
          description: 'Digital Marketing Assistant',
          url: null,
          entities: [Object],
          protected: false,
          followers_count: 0,
          friends_count: 77,
          listed_count: 0,
          created_at: 'Thu Jan 27 09:49:19 +0000 2022',
          favourites_count: 23,
          utc_offset: null,
          time_zone: null,
          geo_enabled: false,
          verified: false,
          statuses_count: 0,
          lang: null,
          contributors_enabled: false,
          is_translator: false,
          is_translation_enabled: false,
          profile_background_color: 'F5F8FA',
          profile_background_image_url: null,
          profile_background_image_url_https: null,
          profile_background_tile: false,
          profile_image_url: 'http://pbs.twimg.com/profile_images/1486637435144441859/upWjYXw8_normal.png',
          profile_image_url_https: 'https://pbs.twimg.com/profile_images/1486637435144441859/upWjYXw8_normal.png',
          profile_link_color: '1DA1F2',
          profile_sidebar_border_color: 'C0DEED',
          profile_sidebar_fill_color: 'DDEEF6',
          profile_text_color: '333333',
          profile_use_background_image: true,
          has_extended_profile: true,
          default_profile: true,
          default_profile_image: false,
          following: false,
          live_following: false,
          follow_request_sent: false,
          notifications: false,
          muting: false,
          blocking: false,
          blocked_by: false,
          translator_type: 'none',
          withheld_in_countries: []
        },
        {
          id: 865081363,
          id_str: '865081363',
          name: 'Miseteyaru',
          screen_name: 'techniksecrete',
          location: '',
          description: '',
          url: null,
          entities: [Object],
          protected: false,
          followers_count: 15,
          friends_count: 176,
          listed_count: 2,
          created_at: 'Sat Oct 06 18:07:01 +0000 2012',
          favourites_count: 497,
          utc_offset: null,
          time_zone: null,
          geo_enabled: false,
          verified: false,
          statuses_count: 155,
          lang: null,
          status: [Object],
          contributors_enabled: false,
          is_translator: false,
          is_translation_enabled: false,
          profile_background_color: 'C0DEED',
          profile_background_image_url: 'http://abs.twimg.com/images/themes/theme1/bg.png',
          profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme1/bg.png',
          profile_background_tile: false,
          profile_image_url: 'http://pbs.twimg.com/profile_images/1116700386239352833/Ezbnw7j2_normal.jpg',
          profile_image_url_https: 'https://pbs.twimg.com/profile_images/1116700386239352833/Ezbnw7j2_normal.jpg',
          profile_link_color: '1DA1F2',
          profile_sidebar_border_color: 'C0DEED',
          profile_sidebar_fill_color: 'DDEEF6',
          profile_text_color: '333333',
          profile_use_background_image: true,
          has_extended_profile: true,
          default_profile: true,
          default_profile_image: false,
          following: false,
          live_following: false,
          follow_request_sent: false,
          notifications: false,
          muting: false,
          blocking: false,
          blocked_by: false,
          translator_type: 'none',
          withheld_in_countries: []
        },
        {
          id: 2602263572,
          id_str: '2602263572',
          name: 'Nouhe Tarfas',
          screen_name: 'NouheTarfas',
          location: '',
          description: 'Building @sweethelpapp Shopify app',
          url: null,
          entities: [Object],
          protected: false,
          followers_count: 22,
          friends_count: 182,
          listed_count: 5,
          created_at: 'Thu Jul 03 21:17:49 +0000 2014',
          favourites_count: 59,
          utc_offset: null,
          time_zone: null,
          geo_enabled: false,
          verified: false,
          statuses_count: 134,
          lang: null,
          status: [Object],
          contributors_enabled: false,
          is_translator: false,
          is_translation_enabled: false,
          profile_background_color: 'C0DEED',
          profile_background_image_url: 'http://abs.twimg.com/images/themes/theme1/bg.png',
          profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme1/bg.png',
          profile_background_tile: false,
          profile_image_url: 'http://pbs.twimg.com/profile_images/974475782952226817/8wxvyVJs_normal.jpg',
          profile_image_url_https: 'https://pbs.twimg.com/profile_images/974475782952226817/8wxvyVJs_normal.jpg',
          profile_banner_url: 'https://pbs.twimg.com/profile_banners/2602263572/1404422367',
          profile_link_color: '1DA1F2',
          profile_sidebar_border_color: 'C0DEED',
          profile_sidebar_fill_color: 'DDEEF6',
          profile_text_color: '333333',
          profile_use_background_image: true,
          has_extended_profile: false,
          default_profile: true,
          default_profile_image: false,
          following: false,
          live_following: false,
          follow_request_sent: false,
          notifications: false,
          muting: false,
          blocking: false,
          blocked_by: false,
          translator_type: 'none',
          withheld_in_countries: []
        }
      ],
      next_cursor: 1723425115996095000,
      next_cursor_str: '1723425115996095039',
      previous_cursor: 0,
      previous_cursor_str: '0',
      total_count: null
    };

    const followerUser = res.users;

    if (!force && _.difference(_.pluck(latestFollowerUsers[user._id] || [], 'id'), _.pluck(followerUser, 'id')).length === 0) {
      console.log('no diff, just skip', user._id);
      return;
    }

    latestFollowerUsers[user._id] = followerUser;

    const canvas = new fabric.StaticCanvas();
    canvas.setWidth(1500);
    canvas.setHeight(500);
  
    const loadFromJSON = (c, cb) => { canvas.loadFromJSON(c, () => { cb(undefined, true); }); };
    const loadFromJSONSync = Meteor.wrapAsync(loadFromJSON);
  
    loadFromJSONSync(user.profile.canvas);

    const fabricImageFromURL = (url, cb) => { fabric.Image.fromURL(url, image => { cb(undefined, image); }); };
    const fabricImageFromURLSync = Meteor.wrapAsync(fabricImageFromURL);

    const object = user.profile.canvas.objects.find(o => o.type === 'rect');

    for (let i = 0; i < followerUser.length; i++) {
      const image = fabricImageFromURLSync(followerUser[i].profile_image_url_https);

      image.set({
        left: object.left + i * ((object.width * object.scaleX - 48) / (followerUser.length - 1)),
        top: object.top,
        clipPath: new fabric.Circle({ radius: 24, originX: 'center', originY: 'center' }),
      });

      canvas.add(image);
    };

    // console.log(canvas.toObject());

    const dataUrl = canvas.toDataURL({ format: 'jpeg', quality: 0.99 });
    const banner = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
  
    canvas.clear();
    canvas.dispose();
  
    fs.writeFileSync('/tmp/banner.jpg', banner, 'base64');

    Promise.await(client.post('account/update_profile_banner', { banner }));
  });
};

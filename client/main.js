import { fabric } from 'fabric';

canvas = undefined;

const saveCanvas = () => {
  console.log('saving...');
  Meteor.users.update(Meteor.userId(), { $set: { 'profile.canvas': canvas.toObject() } });
};

Template.users.onCreated(function helloOnCreated() {
  this.subscribe('users');

  this.autorun(c => {
    console.log('load');
    const user = Meteor.user();
    if (!user || !user.profile || !user.profile.canvas) return;

    canvas.loadFromJSON(user.profile.canvas);
    c.stop();
  });
});

Template.users.helpers({
  users() { return Meteor.users.find(); },
  userCount() { return Meteor.users.find().count(); },
});

Template.settings.events({
  'click .js-enable'() {
    Meteor.users.update(Meteor.userId(), { $unset: { 'profile.disable': true } });
  },
  'click .js-disable'() {
    Meteor.users.update(Meteor.userId(), { $set: { 'profile.disable': true } });
  },
});


// fabric

Template.fabric.events({
  'click .js-save'() {
    Meteor.call('save');
  },
  'click .js-text-add'() {
    const text = new fabric.Textbox('Double click to change this text', { left: 10, top: 10, width: 600, fontSize: 20 });
    canvas.add(text);
    saveCanvas();
  },
  'click .js-image-add'() {
    fabric.Image.fromURL(prompt('image url'), oImg => {
      oImg.top = 10;
      oImg.left = 10;
      canvas.add(oImg);
      saveCanvas();
    });
  },
  'change .js-background-color-set'(event) {
    canvas.backgroundColor = event.currentTarget.value;
    canvas.renderAll();
    saveCanvas();
  },
});

Template.fabric.onRendered(() => {
  canvas = new fabric.Canvas('canvas');

  canvas.on('object:removed', saveCanvas);
  canvas.on('object:modified', saveCanvas);
  canvas.on('text:changed', saveCanvas);

  // const rect = new fabric.Rect({ top : 500 - 48 - 5, left : 5, width : 260, height : 48, fill : 'red' });
  // canvas.add(rect);

  // const text = new fabric.Textbox('This is a dynamic work in progress banner.\nFollow me on twitch.tv/acemtp to see the progress 📺', { left: 10, top: 10, width: 600, fontSize: 20 });
  // canvas.add(text);
});

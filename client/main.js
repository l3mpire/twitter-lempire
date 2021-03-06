import { fabric } from 'fabric';

canvas = undefined;

const saveCanvas = () => {
  console.log('saving...');
  const can = canvas.toObject();
  can.objects[0].selectable = false;
  Meteor.users.update(Meteor.userId(), { $set: { 'profile.canvas': can } });
};

Template.users.onCreated(function helloOnCreated() {
  this.subscribe('users');

  this.autorun(c => {
    console.log('load');
    const user = Meteor.user();
    if (!user || !user.profile || !user.profile.canvas) return;

    // create delete control

    const img = document.createElement('img');
    img.src = `data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E`;

    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = 'blue';
    fabric.Object.prototype.cornerStyle = 'circle';

    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetX: -20,
      cursorStyle: 'pointer',
      mouseUpHandler(eventData, transform) {
        const { target } = transform;
        canvas.remove(target);
        canvas.requestRenderAll();
      },
      render(ctx, left, top, styleOverride, fabricObject) {
        const size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
        ctx.restore();
      },
      cornerSize: 24,
    });

    fabric.Textbox.prototype.controls.deleteControl = fabric.Object.prototype.controls.deleteControl;

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

Template.fabric.onRendered(function () {
  canvas = new fabric.Canvas('canvas');
  canvas.on('object:removed', saveCanvas);
  canvas.on('object:modified', saveCanvas);
  canvas.on('text:changed', saveCanvas);
  // create delete control

  const img = document.createElement('img');
  img.src = `data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E`;

  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = 'blue';
  fabric.Object.prototype.cornerStyle = 'circle';

  fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetX: -20,
    cursorStyle: 'pointer',
    mouseUpHandler(eventData, transform) {
      const { target } = transform;
      canvas.remove(target);
      canvas.requestRenderAll();
    },
    render(ctx, left, top, styleOverride, fabricObject) {
      const size = this.cornerSize;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
    },
    cornerSize: 24,
  });

  fabric.Textbox.prototype.controls.deleteControl = fabric.Object.prototype.controls.deleteControl;

  this.autorun(c => {
    console.log('load');
    const user = Meteor.user();
    if (!user || !user.profile || !user.profile.canvas) return;
    canvas.loadFromJSON(user.profile.canvas);
    c.stop();
  });
});

Template.fabric.onDestroyed(() => {
  canvas.dispose();
});

Template.fabric.helpers({
  color0() { return Meteor.user().profile.canvas.objects[0].fill.colorStops[0].color; },
  color1() { return Meteor.user().profile.canvas.objects[0].fill.colorStops[1].color; },
});

Template.fabric.events({
  'click .js-save'() {
    Meteor.call('save');
  },
  'click .js-text-add'() {
    const text = new fabric.Textbox('Double click to change this text', {
      left: 10,
      top: 10,
      width: 600,
      fontSize: 20,
      scaleX: 1.5,
      scaleY: 1.5,
      fill: 'white',
      fontFamily: 'Arial',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    saveCanvas();
  },
  'click .js-image-add'() {
    // eslint-disable-next-line no-alert
    fabric.Image.fromURL(prompt('image url'), oImg => {
      oImg.top = 10;
      oImg.left = 10;
      canvas.add(oImg);
      canvas.setActiveObject(oImg);
      saveCanvas();
    });
  },
  'click .js-followers-add'() {
    const rect = new fabric.Rect({ top: 500 - 48 - 5, left: 5, width: 260, height: 48, fill: 'red' });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    saveCanvas();
  },
  'input .js-background-color0-set'(event) {
    const back = canvas.getObjects()[0];
    back.fill.colorStops[0].color = event.currentTarget.value;
    back.set({ fill: new fabric.Gradient(back.fill) });
    canvas.renderAll();
    canvas.requestRenderAll();
    saveCanvas();
  },
  'input .js-background-color1-set'(event) {
    const back = canvas.getObjects()[0];
    back.fill.colorStops[1].color = event.currentTarget.value;
    back.set({ fill: new fabric.Gradient(back.fill) });
    canvas.renderAll();
    canvas.requestRenderAll();
    saveCanvas();
  },
});

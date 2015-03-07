var path = require('path');
var docker = require('../lib/docker');
var state = require('../lib/state');

var TEMPLATE_PATH = path.resolve(__dirname, '../templates/build-Dockerfile');

module.exports = function(topic) {
  return {
    topic: topic,
    command: 'build',
    description: 'builds a Node.js app based on the cedar-14 image',
    help: `help text for ${topic}:build`,
    run: function(context) {
      docker.startB2D();
      var runImageId = state.get(context.cwd).runImageId;
      var buildImageId = docker.buildImageFromTemplate(context.cwd, TEMPLATE_PATH, {
        runImageId: runImageId
      });
      state.set(context.cwd, { buildImageId: buildImageId });
    }
  };
};

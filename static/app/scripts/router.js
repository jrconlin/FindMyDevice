/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'jquery',
  'backbone',
  'models/device',
  'views/location'
], function ($, Backbone, Device, LocationView) {
  'use strict';

  var Router = Backbone.Router.extend({
    routes: {
      '': 'showLocation'
    },

    initialize: function() {
      // Convert our embedded globals to models
      window.currentDevice = new Device(window.currentDevice);
      window.currentUser = new Backbone.Model(window.currentUser);
    },

    showLocation: function() {
      this.setStage(new LocationView());
    },

    setStage: function(view) {
      $('#stage').html(view.render().el);

      view.afterInsert();
    }
  });

  // Return a singleton
  return new Router();
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'underscore',
  'jquery'
], function (_, $) {
  'use strict';

  var ModalManager = {
    TARGET_PADDING_TOP: 0,

    initialize: function () {
      this._views = [];
      this.$modal = $('#modal');

      // Listen for all clicks
      $(document).on('click', _.bind(this._closeOnClick, this));

      // Close modal on resize to prevent weirdness between desktop and mobile
      $(document).on('resize', _.debounce(_.bind(this.close, this), 100));

      // Handle default button actions
      this.$modal.on('click', 'a.close', _.bind(this.close, this));
      this.$modal.on('click', 'a.back', _.bind(this.pop, this));
    },

    open: function (view, target) {
      this._destroyViews();

      this.push(view, target);
    },

    push: function (view, target) {
      this._views.push(view);

      this._show(target);
    },

    pop: function () {
      var view = this._views.pop();

      if (view) {
        view.destroy();
      }

      if (this._views.length > 0) {
        this._show();
      } else {
        this._hide();
      }
    },

    close: function () {
      this._destroyViews();

      this._hide();
    },

    _destroyViews: function () {
      _.invoke(this._views, 'destroy');

      this._views = [];
    },

    _show: function (target) {
      var view = _.last(this._views);

      view.render();
      // Force delegate events to fix an issue where restoring a previous view breaks event bindings
      view.delegateEvents();

      // Position the modal
      var position = this.$modal.position();

      if (target) {
        var $target = $(target);
        var offset = $target.offset();

        position.left = offset.left;
        position.top = offset.top + $target.height() + this.TARGET_PADDING_TOP;
      }

      this.$modal.css({ left: position.left, top: position.top });

      // Replace modal contents
      this.$modal.html(view.el).show();

      // Copy view classes to modal div
      this.$modal.attr('class', view.className || '');
    },

    _hide: function () {
      this.$modal.hide();
    },

    _closeOnClick: function (event) {
      if (this.$modal.is(':visible')) {
        var $target = $(event.target);

        // Close if target isn't modal, modal isn't the parent, and still in the dom
        if (!$target.is('#modal') && !$target.parents('#modal').length && $target.parents('body').length) {
          this.close();
        }
      }
    }
  };

  ModalManager.initialize();

  return ModalManager;
});

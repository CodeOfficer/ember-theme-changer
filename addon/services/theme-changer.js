import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Evented from '@ember/object/evented';
import { isEmpty } from '@ember/utils';
import { isArray } from '@ember/array';
import { getOwner } from '@ember/application';
import { warn } from '@ember/debug';

export default Service.extend(Evented, {
  assetMap: service(),
  headData: service(),

  defaultTheme: null,
  eventName: 'ember-theme-changerr__theme-changed',

  themeValue: '',

  // @private
  init() {
    this._super(...arguments);

    const owner = getOwner(this);
    const ENV = owner.factoryFor('config:environment').class;
    const config = ENV.theme;

    if (!config) {
      warn(
        'Ember-theme-changerr did not find a theme configuration.\neg: themes: { themes: [\'theme1\', \'theme2\',...] }.',
        { id: 'ember-theme-changerr.theme' }
      );

      return;
    } else if (config.themes == null) {
      warn(
        'Ember-theme-changerr did not find themes in your environment file.\neg: themes: { themes: [\'theme1\', \'theme2\',...] }.',
        { id: 'ember-theme-changerr.themes' }
      );

      return;
    } else if (isEmpty(config.themes)) {
      warn(
        'Ember-theme-changerr requires themes to be defined. Please add an array of supported themes in your Environment file.\neg: themes: { themes: [\'theme1\', \'theme2\',...] }.',
        { id: 'ember-theme-changerr.themes.empty' }
      );

      return;
    } else if (!isArray(config.themes)) {
      warn(
        'Ember-theme-changerr requires the themes configuration to be an array. Please add an array of supported themes in your Environment file.\neg: themes: { themes: [\'theme1\', \'theme2\',...] }.',
        { id: 'ember-theme-changerr.themes.array' }
      );

      return;
    }

    let defaultTheme = (config || {}).defaultTheme;

    if (defaultTheme == null) {
      defaultTheme = config.themes.get('firstObject');

      warn(
        `Ember-theme-changerr did not find a default theme; falling back to "${defaultTheme}".`,
        { id: 'ember-theme-changerr.default-theme' }
      );
    } else {
      if (!config.themes.includes(defaultTheme)) {
        const firstTheme = config.themes.get('firstObject');

        warn(
          `Ember-theme-changerr, default theme '${defaultTheme}' is not listed as part of the themes list: '${config.themes}'. Defaulting to '${firstTheme}'.`,
          { id: 'ember-theme.changerr.invalid-default-theme' }
        );

        defaultTheme = firstTheme;
      }
      this.set('themeValue', defaultTheme);
    }

    if (!isEmpty(ENV.theme.eventName)) {
      this.set('eventName', ENV.theme.eventName);
    }

    this.set('defaultTheme', defaultTheme);
  },

  // @private
  _generateStyleTag() {
    const {
      defaultTheme
    } = this.getProperties(
      'defaultTheme'
    );
    const themeValue = defaultTheme;

    if (!isEmpty(themeValue)) {
      this.set('headData.themeHref', this._getAssetFullPath(themeValue));
      this.trigger('theme-changed', themeValue);
    }
  },

  // @private
  _getAssetFullPath(assetName) {
    return this.get('assetMap').resolve(`assets/${assetName}.css`);
  },

  // @public
  onThemeChanged(callback) {
    const eventName = this.get('eventName');

    this.on(eventName, callback);
  },

  // @public
  offThemeChanged() {
    const eventName = this.get('eventName');

    this.off(eventName);
  },

  // @public
  theme: computed({
    get() {
      const {
        defaultTheme, eventName
      } = this.getProperties(
        'defaultTheme', 'eventName'
      );

      let themeValue;

      themeValue = defaultTheme;

      return themeValue;
    },

    set(key, value) {
      const {
        eventName
      } = this.getProperties(
        'eventName'
      );

      this.set('headData.themeHref', this._getAssetFullPath(value));

      this.set('themeValue', value);

      this.trigger(eventName, value);

      return value;
    }
  })
});

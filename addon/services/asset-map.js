import Service from '@ember/service';
import { debug, warn } from '@ember/debug';
import { isNone } from '@ember/utils';
import { getOwner } from '@ember/application';

export default Service.extend({
  enabled: false,
  assetMapHash: null,
  prepend: '/',
  isRelativePath: true,
  
  // @private
  init() {
    this._super(...arguments);

    const owner = getOwner(this);
    const ENV = owner.factoryFor('config:environment').class;
    const config = ENV.theme;

    if (!config.isRelativePath) {
      this.set('isRelativePath', false);
    }
  },
  resolve(name) {
    const map = this.get('assetMapHash');
    let resolvedName;

    if (this.get('enabled')) {
      if (isNone(map[name])) {
        warn(
          `No mapped asset found for: ${name}`,
          { id: 'ember-theme-changerr.asset-map' }
        );

        return null;
      }

      resolvedName = map[name];
      debug(`Asset resolved name: ${resolvedName} (source: ${name})`);
    } else {
      resolvedName = name;
    }
    
    if (this.get('isRelativePath')) {
      return this.get('prepend') + resolvedName;
    }
    
    return resolvedName;
  }
});

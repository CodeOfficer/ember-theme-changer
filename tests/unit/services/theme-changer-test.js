import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';

module('Unit | Service | theme-changer', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    const assetMapHash = {
      'assets/light.css': '/assets/light-output.css',
      'assets/dark.css': '/assets/dark-output.css'
    };

    const AssetMapStub = Service.extend({
      enabled: true,
      resolve(name) {
        return assetMapHash[name];
      }
    });

    this.owner.register('service:assetMap', AssetMapStub);
  });

  test('it changes the themeHref when the theme changes', function(assert) {
    const service = this.owner.lookup('service:theme-changer');

    service.set('theme', 'light');
    assert.equal(service.get('headData.themeHref'), '/assets/light-output.css');

    service.set('theme', 'dark');
    assert.equal(service.get('headData.themeHref'), '/assets/dark-output.css');
  });
});

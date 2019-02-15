import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setProperties } from '@ember/object';

module('Unit | Service | theme-changer', function(hooks) {
  setupTest(hooks);

  test('it changes the themeHref when the theme changes', function(assert) {
    const service = this.owner.lookup('service:theme-changer');

    setProperties(service.assetMap, {
      enabled: true,
      assetMapHash: {
        'assets/light.css': 'assets/light-output.css',
        'assets/dark.css': 'assets/dark-output.css'
      }
    });

    service.set('theme', 'light');
    assert.equal(service.headData.themeHref, '/assets/light-output.css');

    service.set('theme', 'dark');
    assert.equal(service.headData.themeHref, '/assets/dark-output.css');
  });
});

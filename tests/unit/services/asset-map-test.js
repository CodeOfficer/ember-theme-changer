import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setProperties } from '@ember/object';

module('Unit | Service | asset-map', function(hooks) {
  setupTest(hooks);

  test('it resolves theme paths from the assetMap', function(assert) {
    const service = this.owner.lookup('service:asset-map');

    setProperties(service, {
      enabled: true,
      assetMapHash: {
        'assets/light.css': 'assets/light-output.css',
        'assets/dark.css': 'assets/dark-output.css'
      }
    });

    assert.equal(service.resolve('assets/light.css'), '/assets/light-output.css');
    assert.equal(service.resolve('assets/dark.css'), '/assets/dark-output.css');
  });

  test('it resolves null for unknown themes', function(assert) {
    const service = this.owner.lookup('service:asset-map');

    assert.equal(service.resolve('unknown'), '/unknown');
  });
});

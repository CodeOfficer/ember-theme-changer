import Application from '@ember/application';
import Pretender from 'pretender';
import { initialize } from 'dummy/initializers/asset-map';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

function assetMapSuccess() {
  this.get('/assets/assetMap.json', () => {
    return [200, { 'Content-Type': 'application/json' }, JSON.stringify({
      prepend: '/',
      assets: {
        light: 'light.css',
        dark: 'dark.css'
      }
    })];
  });
}

function assetMapFailure() {
  this.get('/assets/assetMap.json', () => {
    return [404];
  });
}

module('Unit | Initializer | asset-map', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.TestApplication = Application.extend();
    this.TestApplication.initializer({
      name: 'initializer under test',
      initialize
    });

    this.application = this.TestApplication.create({ autoboot: false });
    this.server = new Pretender();
  });

  hooks.afterEach(function() {
    run(this.application, 'destroy');
    run(this.server, 'shutdown');
  });

  test('initializes the assetMap to resolve assets', async function(assert) {
    this.application.register('config:environment', {
      theme: {
        useAssetMap: true
      }
    });

    this.server.map(assetMapSuccess);

    let instance;

    try {
      await this.application.boot();
      instance = this.application.buildInstance();

      const assetMap = instance.lookup('service:asset-map');

      assert.equal(assetMap.resolve('light'), '/light.css');
      assert.equal(assetMap.resolve('dark'), '/dark.css');
    } catch (error) {
      assert.notOk(error);
    } finally {
      instance && run(instance, 'destroy');
    }
  });

  test('it handles asset request failures', async function(assert) {
    this.application.register('config:environment', {
      theme: {
        useAssetMap: true
      }
    });

    this.server.map(assetMapFailure);

    let instance;

    try {
      await this.application.boot();
      instance = this.application.buildInstance();

      const assetMap = instance.lookup('service:asset-map');

      assert.equal(assetMap.enabled, false);
    } catch (error) {
      assert.notOk(error);
    } finally {
      instance && run(instance, 'destroy');
    }
  });
});

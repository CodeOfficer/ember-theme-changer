import Application from '@ember/application';

import { initialize } from 'dummy/instance-initializers/theme-init';
import { module } from 'qunit';
import test from 'ember-sinon-qunit/test-support/test';
import { run } from '@ember/runloop';
import Service from '@ember/service';

module('Unit | Instance Initializer | theme-init', function(hooks) {
  hooks.beforeEach(function() {
    this.TestApplication = Application.extend();
    this.TestApplication.instanceInitializer({
      name: 'initializer under test',
      initialize
    });
    this.application = this.TestApplication.create({ autoboot: false });
    this.instance = this.application.buildInstance();
  });

  hooks.afterEach(function() {
    run(this.application, 'destroy');
    run(this.instance, 'destroy');
  });

  test('initializes the theme changer and generates style tags', async function(assert) {
    const _generateStyleTag = this.spy();
    const themeChangerStub = Service.extend({
      _generateStyleTag
    });

    this.application.register('service:theme-changer', themeChangerStub);

    await this.instance.boot();

    assert.ok(_generateStyleTag.calledOnce);
  });
});

import RSVP from 'rsvp';
import $ from 'jquery';
import { isNone } from '@ember/utils';
import AssetMap from '../services/asset-map';
import { warn } from '@ember/debug';

export function initialize(app) {
  // if we're in an engine return early as engines
  // don't need to defer their readiness.

  if (!app.deferReadiness) {
    return;
  }

  app.deferReadiness();
  const config = app.resolveRegistration('config:environment');

  const useAssetMap = (isNone(config.theme) && isNone(config.theme.useAssetMap)) ?
    config.environment === 'production' :
    config.theme.useAssetMap;

  if (!useAssetMap) {
    app.register('service:asset-map', AssetMap);
    app.advanceReadiness();
    return;
  }

  const promise = new RSVP.Promise((resolve, reject) => {
    $.getJSON('/assets/assetMap.json', resolve).fail(reject);
  });

  promise
    .then(
      (map = {}) => {
        const prepend = config.theme.assetPrepend || map.prepend;

        AssetMap.reopen({
          assetMapHash: map.assets,
          prepend,
          enabled: true
        });
      },
      (/* reason */) => {
        warn(
          'Error loading assetMap.json. Did you forget to set:\nfingerprint: {\n fingerprintAssetMap=true\n}\nin your ember-cli-build file?',
          { id: 'ember-theme-changerr.asset-map' }
        );
      })
    .then(() => {
      app.register('service:asset-map', AssetMap);
      app.advanceReadiness();
    });
}

export default {
  name: 'asset-map',
  initialize
};

import fetch from 'fetch';
import { isNone } from '@ember/utils';
import AssetMap from 'ember-theme-changerr/services/asset-map';
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

  fetch('/assets/assetMap.json', {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  }).then((map) => {
    const prepend = config.theme.assetPrepend || map.prepend;
    const EnabledAssetMap = AssetMap.extend({
      assetMapHash: map.assets,
      prepend,
      enabled: true
    });

    app.register('service:asset-map', EnabledAssetMap);
  }).catch(() => {
    warn(
      'Error loading assetMap.json. Did you forget to set:\nfingerprint: {\n fingerprintAssetMap=true\n}\nin your ember-cli-build file?',
      { id: 'ember-theme-changerr.asset-map' }
    );
    app.register('service:asset-map', AssetMap);
  }).finally(() => {
    app.advanceReadiness();
  });
}

export default {
  name: 'asset-map',
  initialize
};

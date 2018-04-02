export function initialize(applicationInstance) {
  applicationInstance
    .lookup('service:theme-changer')
    ._generateStyleTag();
}

export default {
  name: 'ember-theme-changerr-init',
  initialize
};

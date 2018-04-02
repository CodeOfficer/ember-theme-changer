export function initialize(applicationInstance) {
  applicationInstance
    .lookup('service:theme-changer')
    ._generateStyleTag();
}

export default {
  name: 'ember-theme-changer-init',
  initialize
};

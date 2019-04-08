'use strict';

const visit = require('unist-util-visit');
const Typograf = require('typograf');

module.exports = ({markdownAST}, pluginOptions = {}) => {
  visit(markdownAST, 'text', node => {
    const tp = new Typograf({locale: ['ru']});
    const disabledRules = ['common/space/trimRight', 'common/space/trimLeft', 'common/symbols/cf'];

    disabledRules.forEach(rule => {
      tp.disableRule(rule);
    });

    node.value = String(tp.execute(node.value));
  });

  return markdownAST;
};

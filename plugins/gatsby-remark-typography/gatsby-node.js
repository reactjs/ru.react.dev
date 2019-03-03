'use strict';

const Typograf = require('typograf');

exports.onPreExtractQueries = async ({store, getNodes}) => {
  const tp = new Typograf({locale: ['ru']});
  const fields = ['title', 'content'];
  const markdownNodes = getNodes().filter(node => {
    return node.internal.type === 'MarkdownRemark';
  });

  markdownNodes.forEach(node => {
    fields.forEach(field => {
      const value = node.frontmatter[field];

      if (!value) {
        return;
      }

      node.frontmatter[field] = tp.execute(value);
    });
  });
};

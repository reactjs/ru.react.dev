'use strict';

const Typograf = require('typograf');

exports.onPreExtractQueries = async ({store, getNodes}) => {
  const tp = new Typograf({locale: ['ru']});
  const markdownNodes = getNodes().filter(node => {
    return node.internal.type === 'MarkdownRemark';
  });

  markdownNodes.forEach(node => {
    node.frontmatter.title = tp.execute(node.frontmatter.title)
  });
};

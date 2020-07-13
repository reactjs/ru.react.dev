/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 */

import React from 'react';
import {graphql} from 'gatsby';
import Layout from 'components/Layout';
import MarkdownPage from 'components/MarkdownPage';
import {createLinkBlog} from 'utils/createLink';

const toSectionList = allMarkdownRemark => [
  {
    title: 'Последние посты',
    items: allMarkdownRemark.edges
      .map(({node}) => ({
        id: node.fields.slug,
        title: node.frontmatter.title,
      }))
      .concat({
        id: '/blog/all.html',
        title: 'Все посты ...',
      }),
  },
];

const Blog = ({data, location}) => (
  <Layout location={location}>
    <MarkdownPage
      authors={data.markdownRemark.frontmatter.author}
      createLink={createLinkBlog}
      date={data.markdownRemark.fields.date}
      location={location}
      ogDescription={data.markdownRemark.excerpt}
      markdownRemark={data.markdownRemark}
      sectionList={toSectionList(data.allMarkdownRemark)}
      titlePostfix=" &ndash; React Blog"
    />
  </Layout>
);

export const pageQuery = graphql`
  query TemplateBlogMarkdown($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      excerpt(pruneLength: 500)
      frontmatter {
        title
        next
        prev
        author {
          frontmatter {
            name
            url
          }
        }
      }
      fields {
        date(formatString: "DD MMMM, YYYY", locale: "ru")
        path
        slug
      }
    }
    allMarkdownRemark(
      limit: 10
      filter: {fileAbsolutePath: {regex: "/blog/"}}
      sort: {fields: [fields___date], order: DESC}
    ) {
      edges {
        node {
          frontmatter {
            title
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;

export default Blog;

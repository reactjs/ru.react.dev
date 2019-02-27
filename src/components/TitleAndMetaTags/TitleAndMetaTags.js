/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import Helmet from 'react-helmet';
import React from 'react';

const defaultDescription =
  'JavaScript-библиотека для создания пользовательских интерфейсов';

type Props = {
  title: string,
  ogDescription: string,
  ogUrl: string,
};

const TitleAndMetaTags = ({title, ogDescription, ogUrl}: Props) => {
  return (
    <Helmet title={title}>
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:image" content="/logo-og.png" />
      <meta
        property="og:description"
        content={ogDescription || defaultDescription}
      />
      <meta property="fb:app_id" content="623268441017527" />
    </Helmet>
  );
};

export default TitleAndMetaTags;

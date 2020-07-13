/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import Container from 'components/Container';
import Header from 'components/Header';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import Layout from 'components/Layout';
import React from 'react';
import {sharedStyles} from 'theme';

type Props = {
  location: Location,
};

const PageNotFound = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>Страница не найдена</Header>
          <TitleAndMetaTags title="React - Страница не найдена" />
          <div css={sharedStyles.markdown}>
            <p>Мы не смогли найти то, что вы искали.</p>
            <p>
              Пожалуйста, свяжитесь с владельцем сайта, с которого вы перешли по
              URL адресу, и дайте знать о сломанной ссылке.
            </p>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default PageNotFound;

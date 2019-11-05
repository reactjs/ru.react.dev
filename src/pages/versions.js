/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import Layout from 'components/Layout';
import Container from 'components/Container';
import Header from 'components/Header';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import React from 'react';
import {urlRoot} from 'site-constants';
import {sharedStyles} from 'theme';

// $FlowFixMe This is a valid path
import versions from '../../content/versions.yml';

type Props = {
  location: Location,
};

const Versions = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>Версии React</Header>
          <TitleAndMetaTags
            title="React — Версии"
            canonicalUrl={`${urlRoot}/versions/`}
          />
          <div css={sharedStyles.markdown}>
            <p>
              Полная история версий React доступна{' '}
              <a
                href="https://github.com/facebook/react/releases"
                target="_blank"
                rel="noopener">
                на GitHub
              </a>
              .<br />
              Документация к последним версиям может быть также найдена ниже.
            </p>
            <p>
              Секция FAQ содержит информацию о{' '}
              <a href="/docs/faq-versioning.html">
                нашем подходе к версионированию и отношении к стабильности
              </a>
              .
            </p>
            {versions.map(version => (
              <div key={version.title}>
                <h3>{version.title}</h3>
                <ul>
                  <li>
                    <a href={version.changelog} target="_blank" rel="noopener">
                      Список изменений
                    </a>
                  </li>
                  {version.path && (
                    <li>
                      <a href={version.path} rel="nofollow">
                        Документация
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default Versions;

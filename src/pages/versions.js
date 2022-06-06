/**
 * Copyright (c) Facebook, Inc. and its affiliates.
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
<<<<<<< HEAD
              Документация к последним версиям может быть также найдена ниже.
=======
              Changelogs for recent releases can also be found below.
>>>>>>> 9a5bf3e1f1c151720b3ce383fdd9743d4038b71e
            </p>
            <blockquote>
              <p>Note</p>
              <p>
                The current docs are for React 18. For React 17, see{' '}
                <a href="https://17.reactjs.org">https://17.reactjs.org.</a>
              </p>
            </blockquote>
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

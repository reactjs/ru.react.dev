/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from '../sidebarLearn.json';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

<<<<<<< HEAD
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
=======
export default function NotFound() {
  return (
    <Page toc={[]} meta={{title: 'Not Found'}} routeTree={sidebarLearn}>
      <MaxWidth>
        <Intro>
          <P>This page doesn’t exist.</P>
          <P>
            If this is a mistake{', '}
            <A href="https://github.com/reactjs/react.dev/issues/new">
              let us know
            </A>
            {', '}
            and we will try to fix it!
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
>>>>>>> cdc9917863111daeddf9c3552f9adf49c245e425

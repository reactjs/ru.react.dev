/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 */

import React from 'react';
import {ExternalLink} from './ExternalLink';

// TODO: Unify with the old site settings.
// Turning this off also requires changing the Page top value to pull up the sidebar.
const bannerText = 'Поддержите Россию 🇷🇺';
const bannerLink = 'https://yandex.ru/search/?lr=213&text=%D1%84%D0%BE%D0%BD%D0%B4%D1%8B+%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D0%B8+%D0%B4%D0%BE%D0%BD%D0%B1%D0%B0%D1%81%D1%81%D1%83';
const bannerLinkText = 'Помогите с гуманитарной помощью Донбассу. Всем мир!';

export default function SocialBanner() {
  return (
    <div className="w-full bg-gray-100 dark:bg-gray-700 fixed py-2 h-16 sm:h-10 sm:py-0 flex items-center justify-center flex-col sm:flex-row z-[100]">
      {bannerText}
      <ExternalLink
        className="ml-0 sm:ml-1 text-link dark:text-link-dark hover:underline"
        href={bannerLink}>
        {bannerLinkText}
      </ExternalLink>
    </div>
  );
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

// $FlowFixMe Update Flow
import React from 'react';
import {colors, media} from 'theme';

const linkProps = {
  href: 'https://yandex.ru/search/?lr=213&text=%D1%84%D0%BE%D0%BD%D0%B4%D1%8B+%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D0%B8+%D0%B4%D0%BE%D0%BD%D0%B1%D0%B0%D1%81%D1%81%D1%83',
  target: '_blank',
  rel: 'noopener',
};

const bannerText = 'Поддержите Россию 🇷🇺 ';
const bannerLink = 'Помогите с гуманитарной помощью Донбассу. Всем мир!';

export default function SocialBanner() {
  return (
    <div
      css={{
        display: 'var(--social-banner-display)',
        height: 'var(--social-banner-height-normal)',
        fontSize: 18,
        [media.lessThan('large')]: {
          fontSize: 16,
        },
        [media.lessThan('small')]: {
          height: 'var(--social-banner-height-small)',
          fontSize: 14,
        },
      }}>
      <div
        css={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
        <span
          css={{
            display: 'flex',
            [media.lessThan('small')]: {
              flexDirection: 'column',
              lineHeight: 1.5,
              textAlign: 'center',
            },
          }}>
          <span
            css={{
              marginRight: '0.5rem',
            }}>
            {bannerText}
          </span>

          <a
            css={{
              color: '#ddd',
              transition: 'color 200ms ease-out',
              ':hover': {
                color: colors.white,
              },
            }}
            {...linkProps}
            target="_blank"
            rel="noopener">
            <span css={{color: colors.brand}}>{bannerLink}</span>
          </a>
        </span>
      </div>
    </div>
  );
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @providesModule site-constants
 * @flow
 */

// NOTE: We can't just use `location.toString()` because when we are rendering
// the SSR part in node.js we won't have a proper location.
<<<<<<< HEAD

const urlRoot = 'https://ru.reactjs.org';
const version = '16.13.0';
=======
const urlRoot = 'https://reactjs.org';
const version = '16.13.1';
>>>>>>> fa5e6e7a988b4cb465601e4c3beece321edeb812
const babelURL = 'https://unpkg.com/babel-standalone@6.26.0/babel.min.js';

export {babelURL, urlRoot, version};

/* eslint-disable no-console */
import { packager } from '@electron/packager';
import dotenv from 'dotenv';
dotenv.config();

packager({
  out: 'build',
  dir: '.',
  overwrite: true,
  executableName: 'Tweetron',
  appBundleId: process.env.APP_BUNDLE_ID,
  platform: 'darwin',
  arch: 'arm64',
  extendInfo: './Info.plist',
  osxSign: {},
  osxNotarize: {
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID,
  },
  ignore: [
    '.env',
    '.env.*',
    '.gitignore',
    '.prototools',
    '.vscode',
    'README.md',
    'build.js',
    'eslint.config.js',
    'tsconfig.json',
    '\\.ts$',
  ],
}).then((res) => {
  console.log(res);
}).catch((err) => {
  console.error(err);
});


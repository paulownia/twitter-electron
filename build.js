const packager = require('@electron/packager');
const dotenv = require('dotenv');
dotenv.config();

packager({
  out: 'dist',
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
  }
});


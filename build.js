/* eslint-disable no-console */
import { packager } from '@electron/packager';
import dotenv from 'dotenv';
dotenv.config();

// Handle command line arguments
const allowedOption = '--no-sign';
const args = process.argv.slice(2);
const noSign = args.includes(allowedOption);

if (args.length > 0 && (!noSign || args.length > 1)) {
  console.error('Only the --no-sign option is supported.');
  process.exit(1);
}

packager({
  out: 'build',
  dir: '.',
  overwrite: true,
  executableName: 'Tweetron',
  appBundleId: process.env.APP_BUNDLE_ID,
  platform: 'darwin',
  arch: 'arm64',
  extendInfo: './Info.plist',
  osxSign: noSign ? undefined : {},
  osxNotarize: noSign ? undefined : {
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

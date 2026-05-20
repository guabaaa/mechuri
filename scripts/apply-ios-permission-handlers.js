/**
 * react-native-permissions: Podfile setup_permissions 결과를 podspec에 반영.
 * yarn install 후 podspec이 초기화되면 Camera/PhotoLibrary 핸들러가 빠져 런타임 오류가 납니다.
 */
const fs = require('fs');
const path = require('path');

const podspecPath = path.join(
  __dirname,
  '../node_modules/react-native-permissions/RNPermissions.podspec',
);

if (!fs.existsSync(podspecPath)) {
  process.exit(0);
}

const sourceFiles =
  '"ios/*.{h,mm}", "ios/LocationWhenInUse/*.{h,mm}", "ios/PhotoLibrary/*.{h,mm}", "ios/Camera/*.{h,mm}"';
const frameworks = '"CoreLocation", "Photos", "PhotosUI", "AVFoundation"';

let podspec = fs.readFileSync(podspecPath, 'utf8');
const next = podspec
  .replace(/(# *)?s\.source_files *=.*/, `s.source_files = ${sourceFiles}`)
  .replace(/(# *)?s\.frameworks *=.*/, `s.frameworks = ${frameworks}`);

if (next !== podspec) {
  fs.writeFileSync(podspecPath, next);
  console.log('[permissions] RNPermissions.podspec → Camera, PhotoLibrary, LocationWhenInUse');
}

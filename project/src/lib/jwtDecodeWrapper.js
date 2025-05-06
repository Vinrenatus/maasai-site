import * as jwtDecodeModule from 'jwt-decode';

const jwtDecode =
  typeof jwtDecodeModule.default === 'function'
    ? jwtDecodeModule.default
    : typeof jwtDecodeModule.jwtDecode === 'function'
      ? jwtDecodeModule.jwtDecode
      : jwtDecodeModule;

export default jwtDecode;

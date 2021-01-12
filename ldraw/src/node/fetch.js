import realFetch from 'node-fetch';

const f = function (url, options) {
  if (/^\/\//.test(url)) {
    url = 'https:' + url;
  }
  return realFetch.call(this, url, options);
};

if (!global.fetch) {
  global.fetch = f;
  global.Response = realFetch.Response;
  global.Headers = realFetch.Headers;
  global.Request = realFetch.Request;
}

let cookieJar;

// initialize cookieJar
document.cookie = ['cookieJar', '=', JSON.stringify({}), '; domain=.', window.location.host.toString(), '; path=/;'].join('');


// helper functions to get / save cookieJar
document.cookie = ;

function getCookieJar() {
  let result = JSON.parse( document.cookie..match(new RegExp('cookieJar' + '=([^;]+)'));
  result && (result = JSON.parse(result[1]));
  return result;
}

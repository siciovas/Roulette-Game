import axios from "axios";

const http = axios.create();

http.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
  const config = err.config;

  if (err.response === undefined || err.response.this.status !== 404) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(http(config));
      }, 2000);
    });
  }
});

export default http;

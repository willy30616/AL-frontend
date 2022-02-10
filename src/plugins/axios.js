"use strict";

import Vue from "vue";
import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
    // baseURL: process.env.baseURL || process.env.apiUrl || ""
    // timeout: 60 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
    baseURL: "http://192.168.0.69:8777/aluminum/public/api",
    //本地:
    // baseURL: "http://127.0.0.1:8085/aluminum/public/api",
    //測試:
    // baseURL: "http://192.168.0.69:8085/aluminum/public/api",
    // baseURL: "http://172.20.10.5:8085/aluminum/public/api",
    // baseURL: "http://192.168.0.223:5000/aluminum",
    timeout: 30000
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
    function(config) {
        // Do something before request is sent
        return config;
    },
    function(error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
_axios.interceptors.response.use(
    function(response) {
        // Do something with response data
        return response;
    },
    function(error) {
        // Do something with response error

        console.log("找不到API");
        console.log(error);
        return Promise.reject(error);
    }
);

Plugin.install = function(Vue, options) {
    Vue.axios = _axios;
    window.axios = _axios;
    options;
    Object.defineProperties(Vue.prototype, {
        axios: {
            get() {
                return _axios;
            }
        },
        $axios: {
            get() {
                return _axios;
            }
        }
    });
};

Vue.use(Plugin);

export default Plugin;
// export default {
//     install: function(Vue) {
//         Object.defineProperty(Vue.prototype, "$axios", { value: axios });
//     },
// };
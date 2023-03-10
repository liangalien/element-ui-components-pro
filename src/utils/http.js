import axios from 'axios';
import {Message as message} from "element-ui";

const service = axios.create({
  timeout: 600 * 1000
});

const exceptMessage = (error) => {
    message.error(`ERROR: ${error.response.status}, ${error.response.statusText}`);
};

service.easyRequest = (url, method="GET", params=null, data=null, final=null, except=null) => {
    service.request({
        url: url,
        method: method,
        data: data,
        params: params
    }).then((res) => {
        if (final) final(res.data);
    }, except || exceptMessage);
};


export default service;

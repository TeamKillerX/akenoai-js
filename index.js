import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

class DictToObj {
  constructor(dictionary) {
    Object.keys(dictionary).forEach((key) => {
      if (typeof dictionary[key] === 'object' && !Array.isArray(dictionary[key])) {
        this[key] = new DictToObj(dictionary[key]);
      } else if (Array.isArray(dictionary[key])) {
        this[key] = dictionary[key].map((item) =>
          typeof item === 'object' ? new DictToObj(item) : item
        );
      } else {
        this[key] = dictionary[key];
      }
    });
  }

  toString() {
    return JSON.stringify(this);
  }
}

class AkenoaiJs {
    constructor(key = null) {
        this.apiEndpoint = "https://randydev-ryu-js.hf.space/api/v1";
        this.headers = key ? { 'x-api-key': key } : {};
    }
    
    async downloadNow(url) {
        const response = await axios.get(url, { responseType: 'stream' });
        const path = url.split('/').pop();
        response.data.pipe(fs.createWriteStream(path));
        return path;
    }

    async clean(filePath) {
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            return `Error removing file ${filePath}: ${error}`;
        }
    }

    async RandyDev(endpoint, { post = false, custom_dev_fast = false } = {}, params = {}) {
        try {
            let response;
            if (post) {
                response = await axios.post(`${this.apiEndpoint}/${endpoint}`, params, {
                    headers: this.headers,
                });
            } else {
                response = await axios.get(`${this.apiEndpoint}/${endpoint}`, {
                    headers: this.headers,
                    params: params,
                });
            }
            return custom_dev_fast ? response.data : null;
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    }

    async requestGet(endpoint, params = {}) {
        const response = await axios.get(`${this.apiEndpoint}/${endpoint}`, {
            headers: this.headers,
            params: params,
        });
        return response.data;
    }

    async requestPost(endpoint, data = {}, headers = {}) {
        const response = await axios.post(`${this.apiEndpoint}/${endpoint}`, data, {
            headers: { ...this.headers, ...headers },
        });
        return response.data;
    }
    
    async requestFormPost(endpoint, filePath, params = {}) {
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));
        const response = await axios.post(`${this.apiEndpoint}/${endpoint}`, form, {
            params,
            headers: { ...this.headers, ...form.getHeaders() },
        });
        return response.data;
    }
    
    async getJson(response) {
        return new DictToObj(response);
    }
}

export { AkenoaiJs };

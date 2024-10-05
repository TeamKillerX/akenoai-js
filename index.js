const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

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

class AkenoPlus {
  constructor(key = null, apiEndpoint = 'https://private-akeno.randydev.my.id') {
    this.apiEndpoint = apiEndpoint;
    this.headers = key ? { 'x-akeno-key': key } : {};
    this.headersBlacklist = {};
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

  async terabox(link) {
    return this.requestGet('akeno/terabox-v1', { link });
  }

  async teraboxV2(link) {
    return this.requestGet('akeno/terabox-v2', { link });
  }

  async chatgptOld(query) {
    return this.requestPost('ryuzaki/chatgpt-old', { query });
  }

  async chatgptModeWeb(query, params = {}) {
    const combinedParams = { query, ...params };
    return this.requestGet('api/akeno-ai-web', combinedParams);
  }

  async sitesTorrensAll() {
    return this.requestGet('akeno/sites_torrens_all');
  }

  async searchForTorrents(params = {}) {
    return this.requestGet('akeno/search_for_torrents', params);
  }

  async getTorrentFromUrl(params = {}) {
    return this.requestGet('akeno/get_torrent_from_url', params);
  }

  async getRecent(params = {}) {
    return this.requestGet('akeno/get_recent', params);
  }

  async getCategory(params = {}) {
    return this.requestGet('akeno/get_category', params);
  }

  async paalSee(filePath, params = {}) {
    return this.requestFormPost('akeno/paal-see', filePath, params);
  }

  async blackbox(query) {
    return this.requestPost('ryuzaki/blackbox', { query });
  }

  async hentai() {
    return this.requestGet('akeno/hentai');
  }

  async fbdown(link) {
    return this.requestGet('akeno/fbdown-v2', { link });
  }

  async fdownloader(link) {
    return this.requestGet('akeno/fdownloader', { link });
  }

  async capcut(link) {
    return this.requestGet('akeno/capcut-v1', { link });
  }

  async addIpblock(ip) {
    return this.requestPost('add_to_blacklist_ip', { ip });
  }

  async unblockIp(ip) {
    return this.requestPost('remove_from_blacklist_ip', { ip });
  }

  async allowedIp(ip) {
    return this.requestPost('update_allow_ip', { ip });
  }

  async unallowedIp(ip) {
    return this.requestPost('remove_allow_ip', { ip });
  }

  async getJson(response) {
    return new DictToObj(response);
  }
}

module.exports = AkenoPlus;

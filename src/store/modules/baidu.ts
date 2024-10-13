import { defineStore } from "pinia";
import { store, storageLocal } from "../utils";
import {
  getAccessToken,
  getAccurate,
  getParser,
  getTaskQuery,
  getParseData
} from "@/api/baiduApi";

export const useBaiduStore = defineStore({
  id: "baidu-Store",
  state: () => ({
    baiduAccessToken: storageLocal().getItem("baiduAccessToken") ?? ""
  }),
  actions: {
    getAccessTokenAction() {
      if (!this.baiduAccessToken) {
        getAccessToken().then((data: any) => {
          this.baiduAccessToken = data.access_token;
          storageLocal().setItem("baiduAccessToken", data.access_token);
        });
      }
    },
    getAccurateAction(data) {
      return getAccurate(data, this.baiduAccessToken);
    },
    getTaskQueryAction(data) {
      return getParser(data, this.baiduAccessToken).then((data: any) => {
        const task_id = data?.result?.task_id;
        if (task_id) {
          return getTaskQuery(task_id, this.baiduAccessToken).then(
            (data: any) => {
              const parse_result_url = data?.result?.parse_result_url;
              if (parse_result_url) {
                const cloudContentRegex = parse_result_url.match(/\/cloud(.*)/);
                if (cloudContentRegex && cloudContentRegex[0]) {
                  const cloudContent = cloudContentRegex[0];
                  return getParseData(cloudContent);
                }
                return Promise.reject("parse_result_url地址错误");
              }
              return Promise.reject("parse_result_url为空");
            }
          );
        } else {
          Promise.reject("task_id为空");
        }
      });
    }
  }
});

export function useBaiduStoreHook() {
  return useBaiduStore(store);
}

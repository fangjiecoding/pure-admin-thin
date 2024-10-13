import { http } from "@/utils/http";

const AK = "";
const SK = "";
export const getAccessToken = () => {
  return http.request(
    "post",
    `/baidu-api/oauth/2.0/token?grant_type=client_credentials&client_id=${AK}&client_secret=${SK}`
  );
};

export const getAccurate = (data, baiduAccessToken) => {
  return http.request(
    "post",
    `/baidu-api/rest/2.0/ocr/v1/accurate?access_token=${baiduAccessToken}`,
    {
      data
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      }
    }
  );
};

export const getParser = (data, baiduAccessToken) => {
  return http.request(
    "post",
    `/baidu-api/rest/2.0/brain/online/v2/parser/task?access_token=${baiduAccessToken}`,
    {
      data
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      }
    }
  );
};

export const getTaskQuery = (taskId: string, baiduAccessToken) => {
  return http.request(
    "post",
    `/baidu-api/rest/2.0/brain/online/v2/parser/task/query?access_token=${baiduAccessToken}`,
    {
      data: {
        task_id: "task-Gl2XGE3oEG07Oz6eFtqg9I8o2Jcm94i0"
      }
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      }
    }
  );
};

export const getParseData = url => {
  return http.request(
    "get",
    url,
    {},
    {
      headers: {
        // 获取当前时间iso
        "x-bce-date": new Date().toISOString()
      }
    }
  );
};

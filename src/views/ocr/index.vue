<script setup lang="ts">
import { ref } from "vue";
import { useBaiduStoreHook } from "@/store/modules/baidu";
const baiduStore = useBaiduStoreHook();
baiduStore.getAccessTokenAction();

const base64UrlImage = ref("");
const doOcrImage = options => {
  const { file } = options;
  return new Promise((resolve, reject) => {
    const reader = new FileReader() as any;
    reader.readAsDataURL(file);
    reader.onload = function () {
      const base64 = reader.result;
      base64UrlImage.value = base64;
      const base64String = reader.result.split(",")[1];
      baiduStore
        .getAccurateAction({
          image: base64String,
          detect_direction: "false",
          vertexes_location: "false",
          paragraph: "false",
          probability: "false",
          char_probability: "false"
        })
        .then((data: any) => {
          renderDoms(data.words_result);
        });
    };
  });
};
interface CharacterData {
  words: string;
  location: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}
const renderDoms = (list: CharacterData[]) => {
  // 获取图片包裹div的dom
  const img = document.getElementById("original-image") as HTMLImageElement;
  // 设置样式
  img.style.position = "relative";
  // 遍历所有字符数组，对于每个字符创建一个子元素
  list.forEach(charData => {
    const { words, location } = charData;
    const { top, left, width, height } = location;

    // 创建子元素，并设置其宽度和高度、以及文字内容
    const charElement = document.createElement("div");
    charElement.style.fontSize = `${calculateFontSize(words, width, height)}px`;
    charElement.innerHTML = words;
    charElement.style.width = `${width}px`;
    charElement.style.height = `${height}px`;

    // 设置子元素的位置
    charElement.style.position = "absolute";
    charElement.style.left = `${left}px`;
    charElement.style.top = `${top}px`;

    // 设置文字颜色
    charElement.style.color = "rgba(255, 0, 0, 255)";

    // 将子元素插入到父元素中
    img.appendChild(charElement);
  });
};
/**
 * 计算字体大小的函数
 *
 * @param text 需要计算的文本内容
 * @param targetWidth 目标宽度
 * @param targetHeight 目标高度
 * @param minFontSize 最小字体大小，默认为 10
 * @param maxFontSize 最大字体大小，默认为 100
 * @param threshold 阈值，用于控制计算精度，默认为 1
 */
const calculateFontSize = (
  text: string,
  targetWidth: number,
  targetHeight: number,
  minFontSize = 10,
  maxFontSize = 100,
  threshold = 1
): number => {
  // 创建一个 div 元素作为容器，用于计算实际字体大小
  const container = document.createElement("div");
  container.style.display = "inline-block";
  container.style.width = `${targetWidth}px`;
  container.style.height = `${targetHeight}px`;
  // 创建一个临时的 span 元素，并添加到容器内，用于显示需要计算的文本内容
  const tempElement = document.createElement("span");
  tempElement.style.display = "inline-block";
  tempElement.style.whiteSpace = "pre-wrap";
  tempElement.style.fontFamily = "Arial, sans-serif";
  tempElement.innerText = text;
  container.appendChild(tempElement);
  document.body.appendChild(container);
  // 初始化字体大小的取值范围
  let fontSize = maxFontSize;
  let lowerBound = minFontSize;
  let upperBound = maxFontSize;
  // 使用二分法计算最适合的字体大小
  while (lowerBound <= upperBound) {
    fontSize = Math.floor((lowerBound + upperBound) / 2);
    tempElement.style.fontSize = `${fontSize}px`;
    // 当计算出的实际宽度或高度大于指定的目标宽度和高度时，缩小字体大小并继续计算
    if (
      tempElement.offsetWidth > targetWidth + threshold ||
      tempElement.offsetHeight > targetHeight + threshold
    ) {
      upperBound = fontSize - 1;
    } else {
      // 当计算出的实际宽度和高度小于等于指定的目标宽度和高度时，增大字体大小并继续计算
      lowerBound = fontSize + 1;
    }
  }
  // 从文档中移除容器及其子元素，并返回计算出的最适合的字体大小
  document.body.removeChild(container);
  return fontSize;
};
const base64UrlDoc = ref("");
const doOcrDoc = options => {
  const { file } = options;
  return new Promise((resolve, reject) => {
    const reader = new FileReader() as any;
    reader.readAsDataURL(file);
    reader.onload = function () {
      const base64 = reader.result;
      base64UrlDoc.value = base64;
      const base64String = reader.result.split(",")[1];
      baiduStore
        .getTaskQueryAction({
          file_data: base64String,
          file_name: file.name
        })
        .then((data: any) => {
          console.log(data);
        })
        .catch(error => {
          console.error(error);
        });
    };
  });
};
</script>

<template>
  <div>
    <div style="display: flex; column-gap: 10px">
      <el-upload :http-request="doOcrImage" :show-file-list="false">
        <el-button size="small" type="primary">上传图片</el-button>
      </el-upload>
      <el-upload :http-request="doOcrDoc" :show-file-list="false">
        <el-button size="small" type="primary">上传pdf</el-button>
      </el-upload>
    </div>
    <div style="margin-top: 20px">
      <el-image
        v-if="base64UrlImage"
        id="original-image"
        :src="base64UrlImage"
      />
    </div>
  </div>
</template>

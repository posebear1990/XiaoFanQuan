import { dateUtil } from "./index";

export function formatMessage(message) {
  const textList = [];
  message.text.split(/(@<a.*?<\/a>)|(#<a.*?<\/a>#)/).forEach((text) => {
    if (!text) {
      return;
    }

    if (text.includes("<a")) {
      if (text.includes("@<a")) {
        const re = /@<a.*href=\".*\.com\/(.*)\"\s.*>(.*)<\/a>/;
        const result = re.exec(text);

        textList.push({
          type: "user-name",
          id: result[1],
          text: `@${result[2]}`,
        });
      } else if (text.includes("#<a")) {
        const re = /#<a.*?>(.*)<\/a>#/;
        const result = re.exec(text);
        
        let textResult = `#${result[1]}#`
        
        if(textResult.includes('<b')) {
          textResult = textResult.replace('<b>', '').replace('</b>', '')
        }

        textList.push({
          type: "topic",
          text: textResult,
        });
      } else {
        const re = /<a.*?>(.*)<\/a>/;

        textList.push({
          type: "url",
          text: text.replace(re, (item) => re.exec(text)[1]),
        });
      }
    } else {
      // 转发前没空格加一个，美观
      if (
        text[text.length - 1] === "转" &&
        (text[text.length - 2] !== " " || text[text.length - 2] !== "　")
      ) {
        text = text.substr(0, text.length - 1) + " 转";
      }

      // 处理加粗
      if (text.includes("<b>")) {
        text.split(/(<b>.*?<\/b>)/).forEach((subText) => {
          if (/<b>(.*)<\/b>/.exec(subText)) {
            textList.push({
              type: "emphasize",
              text: /<b>(.*)<\/b>/.exec(subText)[1],
            });
          } else {
            textList.push({
              type: "text-node",
              text: subText,
            });
          }
        });
      } else {
        textList.push({
          type: "text-node",
          text: text,
        });
      }
    }
  });

  return {
    ...message,
    created_at: message.created_at
      ? dateUtil.formatTime(new Date(message.created_at))
      : "",
    source: /<a[^>]*>([\s\S]*?)<\/a>/i.test(message.source)
      ? message.source.match(/<a[^>]*>([\s\S]*?)<\/a>/i)[1]
      : message.source,
    rawText: message.text,
    text: textList,
  };
}

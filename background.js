// 初始化存储
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ targetUrl: null })
    .catch((error) => {
      console.error('Failed to initialize storage:', error);
    });
});

// 监听来自content.js的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openPopup') {
    const createWindow = () => {
      chrome.windows.getCurrent((currentWindow) => {
        const windowOptions = {
          url: chrome.runtime.getURL('popup.html'),
          type: 'popup',
          width: 800,
          height: 600,
          left: currentWindow.left + currentWindow.width - 810,
          top: currentWindow.top
        };
        chrome.windows.create(windowOptions);
      });
    };

    if (request.targetUrl) {
      chrome.storage.local.set({ targetUrl: request.targetUrl })
        .then(() => {
          createWindow();
        })
        .catch((error) => {
          console.error('Failed to set storage:', error);
          createWindow();
        });
    } else {
      createWindow();
    }
  }
});

// 使用declarativeNetRequest API来修改响应头
chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: [1, 2, 3],
  addRules: [
    {
      id: 1,
      priority: 1,
      action: {
        type: "modifyHeaders",
        responseHeaders: [
          { header: "x-frame-options", operation: "remove" },
          { header: "content-security-policy", operation: "remove" }
        ]
      },
      condition: {
        urlFilter: "https://chat.deepseek.com/*",
        resourceTypes: ["main_frame", "sub_frame"]
      }
    },
    {
      id: 2,
      priority: 1,
      action: {
        type: "modifyHeaders",
        responseHeaders: [
          { header: "x-frame-options", operation: "remove" },
          { header: "content-security-policy", operation: "remove" }
        ]
      },
      condition: {
        urlFilter: "https://kimi.moonshot.cn/*",
        resourceTypes: ["main_frame", "sub_frame"]
      }
    },
    {
      id: 3,
      priority: 1,
      action: {
        type: "modifyHeaders",
        responseHeaders: [
          { header: "x-frame-options", operation: "remove" },
          { header: "content-security-policy", operation: "remove" }
        ]
      },
      condition: {
        urlFilter: "https://tongyi.aliyun.com/*",
        resourceTypes: ["main_frame", "sub_frame"]
      }
    }
  ]
});
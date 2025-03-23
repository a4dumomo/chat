// 初始化存储
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ targetUrl: null })
    .catch((error) => {
      console.error('Failed to initialize storage:', error);
    });
});

// 注入侧边栏的函数
function injectSidebar() {
  // 检查是否已存在侧边栏
  const existingSidebar = document.getElementById('mdeepchat-sidebar');
  if (existingSidebar) {
    const isVisible = existingSidebar.style.display === 'none';
    existingSidebar.style.display = isVisible ? 'block' : 'none';
    // 通知悬浮球更新位置
    const floatingBall = document.getElementById('mdeepchat-floating-ball');
    if (floatingBall) {
      floatingBall.style.right = isVisible ? '501px' : '1px';
      floatingBall.innerHTML = isVisible ? 'AI' : 'AI';
    }
    return;
  }
  
  // 创建侧边栏容器
  const sidebarContainer = document.createElement('div');
  sidebarContainer.id = 'mdeepchat-sidebar';
  sidebarContainer.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 500px;
    height: 100vh;
    z-index: 10000;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
  `;
  
  // 创建iframe加载侧边栏内容
  const sidebarFrame = document.createElement('iframe');
  sidebarFrame.src = chrome.runtime.getURL('sidebar.html');
  sidebarFrame.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
    background-color: white;
  `;
  
  // 监听来自iframe的消息
  window.addEventListener('message', (event) => {
    if (event.data === 'hideSidebar') {
      sidebarContainer.style.display = 'none';
    }
  });
  
  // 添加到DOM
  // 添加到DOM后更新悬浮球位置
  sidebarContainer.appendChild(sidebarFrame);
  document.body.appendChild(sidebarContainer);
  
  // 更新悬浮球位置
  const floatingBall = document.getElementById('mdeepchat-floating-ball');
  if (floatingBall) {
    floatingBall.style.right = '501px';
    floatingBall.innerHTML = 'AI';
  }
}

// 监听浏览器操作按钮点击
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    function: injectSidebar
  }).catch(err => console.error("执行脚本失败:", err));
});

// 使用declarativeNetRequest API来修改响应头
chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: [1, 2, 3, 4],
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
    },
    {
      id: 4,
      priority: 1,
      action: {
        type: "modifyHeaders",
        responseHeaders: [
          { header: "x-frame-options", operation: "remove" },
          { header: "content-security-policy", operation: "remove" }
        ]
      },
      condition: {
        urlFilter: "https://yiyan.baidu.com/*",
        resourceTypes: ["main_frame", "sub_frame"]
      }
    }
  ]
});

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleSidebar') {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const activeTab = tabs[0];
      if (activeTab) {
        chrome.scripting.executeScript({
          target: {tabId: activeTab.id},
          function: injectSidebar
        }).then(() => {
          sendResponse({ success: true });
        }).catch((error) => {
          console.error('执行脚本失败:', error);
          sendResponse({ success: false });
        });
      }
    });
    return true; // 保持消息通道开启
  }
});
// 记录插件激活的开始时间
const startTime = performance.now();

document.addEventListener('DOMContentLoaded', function() {
  // 检查是否有目标URL需要切换
  chrome.storage.local.get(['targetUrl'], function(result) {
    if (result.targetUrl) {
      if (result.targetUrl === 'https://chat.deepseek.com/') {
        deepseekNav.click();
      } else if (result.targetUrl === 'https://kimi.moonshot.cn/') {
        kimiNav.click();
      } else if (result.targetUrl === 'https://tongyi.aliyun.com/') {
        tongyiNav.click();
      } else if (result.targetUrl === 'https://yiyan.baidu.com/') {
        yiyanNav.click();
      }
      // 清除存储的URL
      chrome.storage.local.remove('targetUrl');
    }
  });
  // 处理悬浮导航按钮点击事件
  document.querySelectorAll('.hover-nav-button').forEach(button => {
    button.addEventListener('click', () => {
      const url = button.dataset.url;
      if (url === 'https://chat.deepseek.com/') {
        deepseekNav.click();
      } else if (url === 'https://kimi.moonshot.cn/') {
        kimiNav.click();
      } else if (url === 'https://tongyi.aliyun.com/') {
        tongyiNav.click();
      } else if (url === 'https://yiyan.baidu.com/') {
        yiyanNav.click();
      }
    });
  });

  // 计算并显示加载耗时
  const loadTime = ((performance.now() - startTime) / 1000).toFixed(2);
  
  // 显示系统时间和加载耗时
  function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('time-display').textContent = `${timeString} (加载耗时: ${loadTime}秒)`;
  }
  updateTime();
  setInterval(updateTime, 1000);

  // 导航按钮和容器
  const deepseekNav = document.getElementById('deepseek-nav');
  const kimiNav = document.getElementById('kimi-nav');
  const tongyiNav = document.getElementById('tongyi-nav');
  const yiyanNav = document.getElementById('yiyan-nav');
  const deepseekContainer = document.getElementById('deepseek-container');
  const kimiContainer = document.getElementById('kimi-container');
  const tongyiContainer = document.getElementById('tongyi-container');
  const yiyanContainer = document.getElementById('yiyan-container');
  const deepseekFrame = document.getElementById('deepseek-frame');
  const kimiFrame = document.getElementById('kimi-frame');
  const tongyiFrame = document.getElementById('tongyi-frame');
  const yiyanFrame = document.getElementById('yiyan-frame');
  const errorMessage = document.getElementById('error-message');
  const kimiErrorMessage = document.getElementById('kimi-error-message');
  const tongyiErrorMessage = document.getElementById('tongyi-error-message');
  const yiyanErrorMessage = document.getElementById('yiyan-error-message');
  const retryButton = document.getElementById('retry-button');
  const kimiRetryButton = document.getElementById('kimi-retry-button');
  const tongyiRetryButton = document.getElementById('tongyi-retry-button');
  const yiyanRetryButton = document.getElementById('yiyan-retry-button');

  // 切换导航的公共函数
  function switchNavigation(activeNav, activeContainer, activeFrame, frameUrl) {
    // 移除所有导航按钮的active类
    [deepseekNav, kimiNav, tongyiNav, yiyanNav].forEach(nav => nav.classList.remove('active'));
    // 移除所有容器的active类
    [deepseekContainer, kimiContainer, tongyiContainer, yiyanContainer].forEach(container => container.classList.remove('active'));
    
    // 添加active类到当前选中的导航和容器
    activeNav.classList.add('active');
    activeContainer.classList.add('active');
    
    // 如果frame没有src，则设置src
    if (!activeFrame.src) {
      activeFrame.src = frameUrl;
    }
  }

  // 设置导航点击事件
  deepseekNav.addEventListener('click', () => {
    switchNavigation(deepseekNav, deepseekContainer, deepseekFrame, 'https://chat.deepseek.com/');
  });

  kimiNav.addEventListener('click', () => {
    switchNavigation(kimiNav, kimiContainer, kimiFrame, 'https://kimi.moonshot.cn/');
  });

  tongyiNav.addEventListener('click', () => {
    switchNavigation(tongyiNav, tongyiContainer, tongyiFrame, 'https://tongyi.aliyun.com/');
  });

  yiyanNav.addEventListener('click', () => {
    switchNavigation(yiyanNav, yiyanContainer, yiyanFrame, 'https://yiyan.baidu.com/');
  });

  // 处理iframe加载错误
  deepseekFrame.addEventListener('error', () => {
    errorMessage.style.display = 'block';
  });

  kimiFrame.addEventListener('error', () => {
    kimiErrorMessage.style.display = 'block';
  });

  tongyiFrame.addEventListener('error', () => {
    tongyiErrorMessage.style.display = 'block';
  });

  yiyanFrame.addEventListener('error', () => {
    yiyanErrorMessage.style.display = 'block';
  });

  // 重试按钮
  retryButton.addEventListener('click', () => {
    errorMessage.style.display = 'none';
    deepseekFrame.src = deepseekFrame.src;
  });

  kimiRetryButton.addEventListener('click', () => {
    kimiErrorMessage.style.display = 'none';
    kimiFrame.src = kimiFrame.src;
  });

  tongyiRetryButton.addEventListener('click', () => {
    tongyiErrorMessage.style.display = 'none';
    tongyiFrame.src = tongyiFrame.src;
  });

  yiyanRetryButton.addEventListener('click', () => {
    yiyanErrorMessage.style.display = 'none';
    yiyanFrame.src = yiyanFrame.src;
  });
});
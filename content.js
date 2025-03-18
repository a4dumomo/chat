// 检查扩展上下文是否有效的函数
function isExtensionContextValid() {
  try {
    chrome.runtime.getURL('');
    return true;
  } catch (e) {
    return false;
  }
}

// 清理函数
function cleanup() {
  const existingBall = document.getElementById('mdeepchat-floating-ball');
  if (existingBall) {
    existingBall.remove();
  }
  const existingStyle = document.querySelector('style[data-mdeepchat]');
  if (existingStyle) {
    existingStyle.remove();
  }
}

// 初始化函数
function initialize() {
  cleanup();
  
  // 创建悬浮球元素
  const floatingBall = document.createElement('div');
  floatingBall.id = 'mdeepchat-floating-ball';
  floatingBall.innerHTML = `
    <div class="floating-ball-text">紧急支援</div>
    <div class="floating-ball-nav">
      <button class="nav-button" data-url="https://chat.deepseek.com/">Deepseek</button>
      <button class="nav-button" data-url="https://kimi.moonshot.cn/">Kimi</button>
      <button class="nav-button" data-url="https://tongyi.aliyun.com/">通义</button>
      <button class="nav-button" data-url="https://yiyan.baidu.com/">文心一言</button>
    </div>
  `;

  // 添加样式
  const style = document.createElement('style');
  style.setAttribute('data-mdeepchat', 'true');
  style.textContent = `
    #mdeepchat-floating-ball {
      position: fixed;
      right: 1px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10000;
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
      cursor: pointer;
      user-select: none;
      transition: transform 0.3s;
    }

    #mdeepchat-floating-ball .floating-ball-text {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      background-color: #FF69B4;
      color: white;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(255, 105, 180, 0.3);
      flex-direction: column;
      padding: 4px;
      line-height: 1.2;
      font-size: 12px;
    }

    #mdeepchat-floating-ball:hover {
      transform: translateY(-50%) scale(1.1);
    }

    #mdeepchat-floating-ball .floating-ball-text:hover {
      background-color: #FF1493;
      box-shadow: 0 4px 12px rgba(255, 105, 180, 0.5);
    }

    .floating-ball-nav {
      display: none;
      position: absolute;
      right: 0;
      top: 100%;
      background: #87CEEB;
      padding: 8px;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      margin-top: 0px;
    }

    #mdeepchat-floating-ball:hover .floating-ball-nav {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .floating-ball-nav .nav-button {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      background-color: transparent;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
      font-size: 14px;
      color: white;
      width: 100%;
      text-align: center;
    }

    .floating-ball-nav .nav-button:hover {
      background-color: #e0e0e0;
    }
  `;

  // 添加元素到页面
  document.head.appendChild(style);
  document.body.appendChild(floatingBall);

  // 拖拽相关变量
  let isDragging = false;
  let startY = 0;
  let initialTop = 0;

  // 鼠标按下事件
  floatingBall.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('nav-button')) return;
    isDragging = true;
    startY = e.clientY;
    const rect = floatingBall.getBoundingClientRect();
    initialTop = rect.top;
    floatingBall.style.transition = 'none';
    floatingBall.style.cursor = 'grabbing';
    floatingBall.style.transform = 'none';
    e.preventDefault();
  });

  // 鼠标移动事件
  const mouseMoveHandler = (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    const newTop = initialTop + deltaY;
    const maxTop = window.innerHeight - floatingBall.offsetHeight;
    const boundedTop = Math.max(0, Math.min(newTop, maxTop));
    floatingBall.style.top = `${boundedTop}px`;
    floatingBall.style.transform = 'none';
    floatingBall.style.right = '1px';
  };

  // 鼠标松开事件
  const mouseUpHandler = () => {
    if (!isDragging) return;
    isDragging = false;
    floatingBall.style.cursor = 'pointer';
    floatingBall.style.transition = '0.3s';
  };

  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);


  // 只保留导航按钮的点击事件
  floatingBall.querySelectorAll('.nav-button').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isExtensionContextValid()) {
        try {
          const url = e.target.dataset.url;
          chrome.runtime.sendMessage({ action: 'openPopup', targetUrl: url });
        } catch (e) {
          console.error('Extension context error:', e);
          cleanup();
          initialize();
        }
      }
    });
  });
  
  // 阻止悬浮球的点击事件
  floatingBall.querySelector('.floating-ball-text').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
}

// 监听扩展上下文变化
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!isExtensionContextValid()) {
    cleanup();
    initialize();
    return false;
  }
  return true;
});

// 初始化悬浮球
initialize();
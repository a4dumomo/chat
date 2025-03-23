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
  const existingSidebar = document.getElementById('mdeepchat-sidebar');
  if (existingSidebar) {
    existingSidebar.remove();
  }
  const existingBall = document.getElementById('mdeepchat-floating-ball');
  if (existingBall) {
    existingBall.remove();
  }
}

// 创建悬浮球
function createFloatingBall() {
  // 检查是否已存在悬浮球
  if (document.getElementById('mdeepchat-floating-ball')) {
    return;
  }

  const floatingBall = document.createElement('div');
  floatingBall.id = 'mdeepchat-floating-ball';
  floatingBall.innerHTML = 'AI';
  floatingBall.style.cssText = `
    position: fixed;
    right: 1px;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #FFB6C1, #FFC0CB);
    color: white;
    border: 1px solid #FFB6C1;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
    z-index: 999999;
    transition: all 0.3s ease;
    visibility: visible !important;
    opacity: 1 !important;
  `;

  // 悬浮效果
  floatingBall.addEventListener('mouseover', () => {
    floatingBall.style.transform = 'translateY(-50%) scale(1.1)';
  });

  floatingBall.addEventListener('mouseout', () => {
    floatingBall.style.transform = 'translateY(-50%)';
  });

  // 点击事件
  floatingBall.addEventListener('click', () => {
    const sidebar = document.getElementById('mdeepchat-sidebar');
    if (!sidebar || sidebar.style.display === 'none') {
      // 显示侧边栏
      chrome.runtime.sendMessage({ action: 'toggleSidebar', show: true }, (response) => {
        // 等待侧边栏创建完成后再移动悬浮球
        setTimeout(() => {
          const newSidebar = document.getElementById('mdeepchat-sidebar');
          if (newSidebar) {
            floatingBall.style.right = '501px';
            floatingBall.innerHTML = 'AI';
            newSidebar.style.display = 'block';
          }
        }, 100);
      });
    } else {
      // 隐藏侧边栏
      chrome.runtime.sendMessage({ action: 'toggleSidebar', show: false }, () => {
        sidebar.style.display = 'none';
        floatingBall.style.right = '1px';
        floatingBall.innerHTML = 'AI';
      });
    }
  });

  document.body.appendChild(floatingBall);
  
  // 确保悬浮球可见
  setTimeout(() => {
    floatingBall.style.display = 'flex';
    floatingBall.style.visibility = 'visible';
    floatingBall.style.opacity = '1';
  }, 100);
}

// 初始化函数
function initialize() {
  cleanup();
  createFloatingBall();
}

// 立即执行初始化
initialize();

// 确保在页面加载完成后也执行初始化
window.addEventListener('load', initialize);

// 定期检查悬浮球是否存在
setInterval(() => {
  const ball = document.getElementById('mdeepchat-floating-ball');
  if (!ball || ball.style.display === 'none') {
    initialize();
  }
}, 1000);

// 监听扩展上下文变化
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!isExtensionContextValid()) {
    cleanup();
    createFloatingBall();
    return false;
  }
  return true;
});

// 确保在 DOM 加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createFloatingBall);
} else {
  createFloatingBall();
}

// 定期检查悬浮球是否存在，如果不存在则重新创建
setInterval(() => {
  if (!document.getElementById('mdeepchat-floating-ball')) {
    createFloatingBall();
  }
}, 1000);
document.addEventListener('DOMContentLoaded', () => {
  const contentFrame = document.getElementById('content-frame');
  const navItems = document.querySelectorAll('.nav-item');
  const closeButton = document.querySelector('.close-button');
  
  // 默认加载第一个导航选项
  const defaultNav = navItems[0];
  contentFrame.src = defaultNav.dataset.url;
  
  // 导航点击事件
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      contentFrame.src = item.dataset.url;
    });
  });


});
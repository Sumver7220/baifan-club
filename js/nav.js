(function () {
  'use strict';

  var track = document.getElementById('track');
  var navItems = document.querySelectorAll('.nav-item');
  var currentPage = 0;

  /**
   * 切換至指定頁面
   * @param {number} index - 目標頁碼（0–8）
   */
  function goToPage(index) {
    // 移動 track
    track.style.transform = 'translateX(-' + (index * 100) + 'vw)';

    // 更新導覽列 active 狀態
    navItems.forEach(function (item) {
      var isActive = parseInt(item.dataset.target, 10) === index;
      item.classList.toggle('active', isActive);
      if (isActive) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }
    });

    currentPage = index;
  }

  // ─── 導覽列點擊事件 ───────────────────────────────
  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var target = parseInt(this.dataset.target, 10);
      // 確保 track 有 transition（可能被觸控手勢移除）
      track.style.transition = '';
      goToPage(target);
    });
  });

  // ─── 初始化：顯示第 0 頁 ──────────────────────────
  goToPage(0);

})();

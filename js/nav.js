(function () {
  'use strict';

  var track = document.getElementById('track');
  var navItems = document.querySelectorAll('.nav-item');
  var currentPage = 0;

  function goToPage(index) {
    track.style.transform = 'translateX(-' + (index * 100) + 'vw)';
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

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      track.style.transition = '';
      goToPage(parseInt(this.dataset.target, 10));
    });
  });

  // ─── 觸控滑動手勢 ─────────────────────────────────
  var viewport = document.querySelector('.viewport');
  var touchStartX = 0;
  var touchStartY = 0;
  var isHorizontalSwipe = null;

  viewport.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isHorizontalSwipe = null;
    track.style.transition = 'none';
  }, { passive: true });

  viewport.addEventListener('touchmove', function (e) {
    var deltaX = e.touches[0].clientX - touchStartX;
    var deltaY = e.touches[0].clientY - touchStartY;

    if (isHorizontalSwipe === null && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
      isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    }

    if (isHorizontalSwipe !== true) return;

    e.preventDefault();

    var baseOffset = currentPage * window.innerWidth;
    var newOffset = baseOffset - deltaX;
    var minOffset = 0;
    var maxOffset = 8 * window.innerWidth;
    newOffset = Math.max(minOffset, Math.min(maxOffset, newOffset));

    track.style.transform = 'translateX(-' + newOffset + 'px)';
  }, { passive: false });

  viewport.addEventListener('touchend', function (e) {
    track.style.transition = '';

    if (isHorizontalSwipe !== true) return;

    var deltaX = e.changedTouches[0].clientX - touchStartX;

    if (deltaX < -50 && currentPage < 8) {
      goToPage(currentPage + 1);
    } else if (deltaX > 50 && currentPage > 0) {
      goToPage(currentPage - 1);
    } else {
      goToPage(currentPage);
    }

    isHorizontalSwipe = null;
  }, { passive: true });

  // ─── 初始化 ───────────────────────────────────────
  goToPage(0);

})();

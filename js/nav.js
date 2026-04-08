(function () {
  "use strict";

  const track = document.getElementById("track");
  const navItems = document.querySelectorAll(".nav-item");
  const pageJumpButtons = document.querySelectorAll("[data-nav-target]");
  let currentPage = 0;

  function goToPage(index) {
    track.style.transform = "translateX(-" + index * 100 + "vw)";
    navItems.forEach(function (item) {
      const isActive = Number.parseInt(item.dataset.target, 10) === index;
      item.classList.toggle("active", isActive);
      if (isActive) {
        item.setAttribute("aria-current", "page");
      } else {
        item.removeAttribute("aria-current");
      }
    });
    currentPage = index;
  }

  navItems.forEach(function (item) {
    item.addEventListener("click", function () {
      track.style.transition = "";
      goToPage(Number.parseInt(this.dataset.target, 10));
    });
  });

  pageJumpButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      track.style.transition = "";
      goToPage(Number.parseInt(this.dataset.navTarget, 10));
    });

    button.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        track.style.transition = "";
        goToPage(Number.parseInt(this.dataset.navTarget, 10));
      }
    });
  });

  // ─── 觸控滑動手勢 ─────────────────────────────────
  const viewport = document.querySelector(".viewport");
  let touchStartX = 0;
  let touchStartY = 0;
  let isHorizontalSwipe = null;

  viewport.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isHorizontalSwipe = null;
      track.style.transition = "none";
    },
    { passive: true },
  );

  viewport.addEventListener(
    "touchmove",
    function (e) {
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;

      if (
        isHorizontalSwipe === null &&
        (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)
      ) {
        isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
      }

      if (isHorizontalSwipe !== true) return;

      e.preventDefault();

      const baseOffset = currentPage * window.innerWidth;
      let newOffset = baseOffset - deltaX;
      const minOffset = 0;
      const maxOffset = 8 * window.innerWidth;
      newOffset = Math.max(minOffset, Math.min(maxOffset, newOffset));

      track.style.transform = "translateX(-" + newOffset + "px)";
    },
    { passive: false },
  );

  viewport.addEventListener(
    "touchend",
    function (e) {
      track.style.transition = "";

      if (isHorizontalSwipe !== true) return;

      const deltaX = e.changedTouches[0].clientX - touchStartX;

      if (deltaX < -50 && currentPage < 8) {
        goToPage(currentPage + 1);
      } else if (deltaX > 50 && currentPage > 0) {
        goToPage(currentPage - 1);
      } else {
        goToPage(currentPage);
      }

      isHorizontalSwipe = null;
    },
    { passive: true },
  );

  // ─── 初始化 ───────────────────────────────────────
  goToPage(0);
})();

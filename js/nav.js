(function () {
  "use strict";

  const track = document.getElementById("track");
  const navItems = document.querySelectorAll(".nav-item");
  const pageJumpButtons = document.querySelectorAll("[data-nav-target]");
  const pages = document.querySelectorAll(".page");
  const totalPages = pages.length;
  let currentPage = 0;

  document.documentElement.style.setProperty("--page-count", totalPages);

  function goToPage(index) {
    const nextPage = Math.max(0, Math.min(totalPages - 1, index));
    track.style.transform = "translateX(-" + nextPage * 100 + "vw)";
    navItems.forEach(function (item) {
      const isActive = Number.parseInt(item.dataset.target, 10) === nextPage;
      item.classList.toggle("active", isActive);
      if (isActive) {
        item.setAttribute("aria-current", "page");
      } else {
        item.removeAttribute("aria-current");
      }
    });
    currentPage = nextPage;
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
        (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)
      ) {
        isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
      }

      if (isHorizontalSwipe !== true) return;

      e.preventDefault();

      const baseOffset = currentPage * window.innerWidth;
      let newOffset = baseOffset - deltaX;
      const minOffset = 0;
      const maxOffset = Math.max(0, totalPages - 1) * window.innerWidth;
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

      if (deltaX < -50 && currentPage < totalPages - 1) {
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

// ─── Clerk Modal Management ───────────────────────────────────
(function () {
  const modal = document.getElementById("clerkModal");
  const modalImage = document.getElementById("clerkModalImage");

  if (!modal || !modalImage) {
    return;
  }

  let clerkModalOpener = null;

  function openClerkModal(clerkCard) {
    clerkModalOpener = document.activeElement;
    const clerkName = clerkCard.dataset.clerkName || "店員";
    const clerkImage = clerkCard.querySelector("img");
    const clerkImageSrc = clerkImage ? clerkImage.src : "";

    modalImage.src = clerkImageSrc;
    modalImage.alt = clerkName;
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("open");
  }

  function closeClerkModal() {
    modal.setAttribute("aria-hidden", "true");
    modal.classList.remove("open");
    if (clerkModalOpener) {
      clerkModalOpener.focus();
      clerkModalOpener = null;
    }
  }

  document.addEventListener("click", function (event) {
    const clerkCard = event.target.closest(".clerk-card[data-clerk-id]");
    if (clerkCard) {
      openClerkModal(clerkCard);
      return;
    }

    if (event.target.closest(".clerk-modal-overlay, .clerk-modal-close")) {
      closeClerkModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.classList.contains("open")) {
      closeClerkModal();
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") return;

    const clerkCard = event.target.closest(".clerk-card[data-clerk-id]");
    if (!clerkCard) return;

    event.preventDefault();
    openClerkModal(clerkCard);
  });
})();

// ─── Menu Modal Management ──────────────────────────────────
(function () {
  const menuItems = Array.from(
    document.querySelectorAll(
      ".menu-main-poster[data-menu-index], .menu-card[data-menu-index]",
    ),
  ).sort(function (a, b) {
    return (
      Number.parseInt(a.dataset.menuIndex, 10) -
      Number.parseInt(b.dataset.menuIndex, 10)
    );
  });
  const menuModal = document.getElementById("menuModal");
  const menuModalStage = document.querySelector(".menu-modal-stage");
  const menuModalImage = document.getElementById("menuModalImage");
  const menuModalCounter = document.getElementById("menuModalCounter");
  const menuModalClose = document.querySelector(".menu-modal-close");
  const menuModalOverlay = document.querySelector(".menu-modal-overlay");
  const menuModalPrev = document.querySelector(".menu-modal-zone-prev");
  const menuModalNext = document.querySelector(".menu-modal-zone-next");
  let currentMenuIndex = 0;
  let menuModalOpener = null;

  if (
    !menuItems.length ||
    !menuModal ||
    !menuModalStage ||
    !menuModalImage ||
    !menuModalCounter
  ) {
    return;
  }

  function renderMenuImage(index) {
    const normalized = (index + menuItems.length) % menuItems.length;
    const item = menuItems[normalized];
    const img = item.querySelector("img");
    if (!img) return;

    currentMenuIndex = normalized;
    menuModalImage.src = img.src;
    menuModalImage.alt = img.alt || "菜單圖片";
    menuModalCounter.textContent =
      String(normalized + 1) + " / " + String(menuItems.length);
    menuModalImage.classList.remove("is-zoomed");
    menuModalStage.scrollTop = 0;
    menuModalStage.scrollLeft = 0;
  }

  function openMenuModal(index) {
    menuModalOpener = document.activeElement;
    renderMenuImage(index);
    menuModal.setAttribute("aria-hidden", "false");
    menuModal.classList.add("open");
  }

  function closeMenuModal() {
    menuModal.setAttribute("aria-hidden", "true");
    menuModal.classList.remove("open");
    if (menuModalOpener) {
      menuModalOpener.focus();
      menuModalOpener = null;
    }
  }

  function showPrevMenuImage() {
    renderMenuImage(currentMenuIndex - 1);
  }

  function showNextMenuImage() {
    renderMenuImage(currentMenuIndex + 1);
  }

  menuItems.forEach(function (item) {
    item.addEventListener("click", function () {
      const index = Number.parseInt(this.dataset.menuIndex, 10);
      openMenuModal(index);
    });
  });

  menuModalImage.addEventListener("click", function () {
    if (!menuModal.classList.contains("open")) return;
    menuModalImage.classList.toggle("is-zoomed");
  });

  menuModalStage.addEventListener("click", function (e) {
    if (e.target === menuModalStage) {
      closeMenuModal();
    }
  });

  if (menuModalClose) {
    menuModalClose.addEventListener("click", closeMenuModal);
  }

  if (menuModalOverlay) {
    menuModalOverlay.addEventListener("click", closeMenuModal);
  }

  if (menuModalPrev) {
    menuModalPrev.addEventListener("click", showPrevMenuImage);
  }

  if (menuModalNext) {
    menuModalNext.addEventListener("click", showNextMenuImage);
  }

  document.addEventListener("keydown", function (e) {
    if (!menuModal.classList.contains("open")) return;

    if (e.key === "Escape") {
      closeMenuModal();
      return;
    }

    if (e.key === "ArrowLeft") {
      showPrevMenuImage();
      return;
    }

    if (e.key === "ArrowRight") {
      showNextMenuImage();
    }
  });
})();

// ─── 行動版導覽 ─────────────────────────────────────
(function () {
  'use strict';

  var MOBILE_MQ = window.matchMedia('(max-width: 1199px)');

  var mobileHeader = document.querySelector('.mobile-header');
  var hamburger = document.querySelector('.mobile-hamburger');
  var overlay = document.getElementById('mobileMenuOverlay');
  var overlayClose = document.querySelector('.mobile-menu-close');
  var menuItems = document.querySelectorAll('.mobile-menu-item');
  var dots = document.querySelectorAll('.mobile-dot');
  var dotNav = document.querySelector('.mobile-dot-nav');
  var sections = document.querySelectorAll('.page');

  if (!mobileHeader || !overlay || !hamburger) return;

  var observer = null;
  var currentDotIndex = 0;

  // ── Overlay 開關 ─────────────────────────────────
  function openMenu() {
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  overlayClose.addEventListener('click', closeMenu);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeMenu();
    }
  });

  // ── 選單項目點擊跳轉 ─────────────────────────────
  menuItems.forEach(function (item) {
    item.addEventListener('click', function () {
      if (item.classList.contains('mobile-menu-item--disabled')) return;
      var target = parseInt(item.dataset.mobileTarget, 10);
      var section = document.getElementById('page-' + target);
      closeMenu();
      if (section) {
        // 短暫延遲確保 overlay 開始收合後再捲動
        setTimeout(function () {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    });

    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        if (item.classList.contains('mobile-menu-item--disabled')) {
          e.preventDefault();
          return;
        }
      }
    });
  });

  // ── 圓點點擊跳轉 ─────────────────────────────────
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      if (dot.classList.contains('mobile-dot--disabled')) return;
      var target = parseInt(dot.dataset.dotTarget, 10);
      var section = document.getElementById('page-' + target);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── 更新圓點 active 狀態 ──────────────────────────
  function setActiveDot(index) {
    if (index === currentDotIndex) return;
    currentDotIndex = index;

    dots.forEach(function (dot, i) {
      dot.classList.toggle('mobile-dot--active', i === index);
      // visited: 0 .. index-1
      if (!dot.classList.contains('mobile-dot--disabled')) {
        dot.classList.toggle('mobile-dot--visited', i < index);
      }
    });

    // 同步 overlay 選單 active 狀態
    menuItems.forEach(function (item) {
      var t = parseInt(item.dataset.mobileTarget, 10);
      item.classList.toggle('mobile-menu-item--active', t === index);
    });
  }

  // ── IntersectionObserver ──────────────────────────
  function initObserver() {
    if (observer) observer.disconnect();

    var ratioMap = new Map();

    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        ratioMap.set(entry.target, entry.intersectionRatio);
      });

      // 找出可視比例最高的 section
      var maxRatio = 0;
      var activeIndex = currentDotIndex;
      ratioMap.forEach(function (ratio, section) {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          activeIndex = parseInt(section.dataset.page, 10);
        }
      });

      if (maxRatio > 0.05) {
        setActiveDot(activeIndex);
      }
    }, {
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0]
    });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // ── 行動模式初始化 / 清理 ─────────────────────────
  function enterMobileMode() {
    initObserver();
  }

  function exitMobileMode() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    closeMenu();
    // 切換回桌機時重新載入，確保 translateX 狀態正確
    window.location.reload();
  }

  // ── 監聽斷點切換 ─────────────────────────────────
  MOBILE_MQ.addEventListener('change', function (e) {
    if (e.matches) {
      enterMobileMode();
    } else {
      exitMobileMode();
    }
  });

  // ── 初始化 ────────────────────────────────────────
  if (MOBILE_MQ.matches) {
    enterMobileMode();
  }
})();

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

// ─── Clerk Modal Management ───────────────────────────────────
globalThis.openClerkModal = function (clerkId) {
  const clerkCard = document.querySelector(`[data-clerk-id="${clerkId}"]`);
  if (!clerkCard) return;

  const clerkName = clerkCard.dataset.clerkName || "店員";
  const clerkImage = clerkCard.querySelector("img");
  const clerkImageSrc = clerkImage ? clerkImage.src : "";

  // 店員介紹內容（可以根據 clerkId 擴展）
  const introData = {
    1: "我是這間店的店長，歡迎來到白飯俱樂部。最喜歡和各位老闆一起度過愉快的夜晚。",
    2: "Hi！我是小姐姐，擅長烹飪各式餐點，希望能為你帶來美味的體驗～",
    3: "大家好呀～我是甜心，喜歡和老闆們聊天，歡迎常來玩唷！",
    4: "皮皮在這裡！我最愛唱歌和表演，一起來享受這個夜晚吧♪",
    5: "我是寶寶，雖然年紀不大但服務超用心，歡迎點我聊天～",
    6: "天使報到～我喜歡做各式甜點，希望你會喜歡呦！",
    default: "歡迎認識我！我在白飯俱樂部為你服務。",
  };

  const intro = introData[clerkId] || introData.default;

  const modal = document.getElementById("clerkModal");
  if (modal) {
    document.getElementById("clerkModalName").textContent = clerkName;
    document.getElementById("clerkModalDesc").textContent = intro;
    document.getElementById("clerkModalImage").src = clerkImageSrc;
    document.getElementById("clerkModalImage").alt = clerkName;
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("open");
  }
};

globalThis.closeClerkModal = function () {
  const modal = document.getElementById("clerkModal");
  if (modal) {
    modal.setAttribute("aria-hidden", "true");
    modal.classList.remove("open");
  }
};

// ─── Attach Clerk Card Click Handlers ───────────────────────
(function () {
  const clerkCards = document.querySelectorAll(
    ".clerk-card:not(.clerk-card-coming-soon)",
  );
  clerkCards.forEach(function (card) {
    card.addEventListener("click", function () {
      const clerkId = this.dataset.clerkId;
      globalThis.openClerkModal(clerkId);
    });
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
  let currentMenuIndex = 0;

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

  globalThis.openMenuModal = function (index) {
    renderMenuImage(index);
    menuModal.setAttribute("aria-hidden", "false");
    menuModal.classList.add("open");
  };

  globalThis.closeMenuModal = function () {
    menuModal.setAttribute("aria-hidden", "true");
    menuModal.classList.remove("open");
  };

  globalThis.showPrevMenuImage = function () {
    renderMenuImage(currentMenuIndex - 1);
  };

  globalThis.showNextMenuImage = function () {
    renderMenuImage(currentMenuIndex + 1);
  };

  menuItems.forEach(function (item) {
    item.addEventListener("click", function () {
      const index = Number.parseInt(this.dataset.menuIndex, 10);
      globalThis.openMenuModal(index);
    });
  });

  menuModalImage.addEventListener("click", function () {
    if (!menuModal.classList.contains("open")) return;
    menuModalImage.classList.toggle("is-zoomed");
  });

  menuModalStage.addEventListener("click", function (e) {
    if (e.target === menuModalStage) {
      globalThis.closeMenuModal();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (!menuModal.classList.contains("open")) return;

    if (e.key === "Escape") {
      globalThis.closeMenuModal();
      return;
    }

    if (e.key === "ArrowLeft") {
      globalThis.showPrevMenuImage();
      return;
    }

    if (e.key === "ArrowRight") {
      globalThis.showNextMenuImage();
    }
  });
})();

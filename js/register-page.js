(() => {
  const form = document.getElementById("registerPageForm");
  const status = document.getElementById("registerPageStatus");
  const nameInput = document.getElementById("registerPageName");
  const emailInput = document.getElementById("registerPageEmail");
  const passwordInput = document.getElementById("registerPagePassword");
  const openMobileMenu = document.getElementById("openMobileMenu");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const globalBackdrop = document.getElementById("globalBackdrop");

  function setStatus(message, isError = false) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  }

  function setDrawerState(isOpen) {
    if (!mobileDrawer) return;

    mobileDrawer.classList.toggle("is-open", isOpen);
    mobileDrawer.setAttribute("aria-hidden", isOpen ? "false" : "true");

    if (globalBackdrop) {
      globalBackdrop.hidden = !isOpen;
    }

    document.body.classList.toggle("is-locked", isOpen);
  }

  function openDrawer() {
    setDrawerState(true);
  }

  function closeDrawer() {
    setDrawerState(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const name = nameInput?.value.trim() || "";
    const email = emailInput?.value.trim() || "";
    const password = passwordInput?.value || "";

    if (!name || !email || !password) {
      setStatus("Vui lòng nhập đầy đủ họ tên, email và mật khẩu.", true);
      return;
    }

    setStatus("Đang tạo tài khoản...");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const rawText = await response.text();
      let data = {};
      if (rawText) {
        try {
          data = JSON.parse(rawText);
        } catch (parseError) {
          data = { message: rawText };
        }
      }

      if (!response.ok) {
        throw new Error(data.message || `Đăng ký thất bại (${response.status})`);
      }

      setStatus("Đăng ký thành công. Đang chuyển về trang đăng nhập...");
      window.setTimeout(() => {
        window.location.href = "login.html";
      }, 1200);
    } catch (error) {
      setStatus(error.message || "Không thể đăng ký. Vui lòng thử lại.", true);
    }
  }

  openMobileMenu?.addEventListener("click", openDrawer);
  globalBackdrop?.addEventListener("click", closeDrawer);

  document.addEventListener("click", (event) => {
    const closeButton = event.target.closest("[data-close-drawer='mobileDrawer']");
    if (closeButton) {
      closeDrawer();
      return;
    }

    const drawerLink = event.target.closest(".mobile-drawer a");
    if (drawerLink) {
      closeDrawer();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDrawer();
    }
  });

  form?.addEventListener("submit", handleSubmit);
})();

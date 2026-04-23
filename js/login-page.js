(() => {
  const form = document.getElementById("loginPageForm");
  const status = document.getElementById("loginPageStatus");
  const emailInput = document.getElementById("loginPageEmail");
  const passwordInput = document.getElementById("loginPagePassword");
  const rememberInput = document.getElementById("loginPageRemember");
  const openMobileMenu = document.getElementById("openMobileMenu");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const globalBackdrop = document.getElementById("globalBackdrop");

  function setStatus(message, isError = false) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  }

  function hideLoginButton() {
    const loginButton = document.getElementById("openLoginModal");
    if (loginButton) {
      loginButton.style.display = "none";
      loginButton.setAttribute("aria-hidden", "true");
    }
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

    const email = emailInput?.value.trim() || "";
    const password = passwordInput?.value || "";
    const remember = Boolean(rememberInput?.checked);

    if (!email || !password) {
      setStatus("Vui lòng nhập đầy đủ email và mật khẩu.", true);
      return;
    }

    setStatus("Đang đăng nhập...");

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("authToken", data.token);
      storage.setItem("authUser", JSON.stringify(data.user));

      hideLoginButton();

      setStatus("Đăng nhập thành công. Đang chuyển về trang chủ...");
      window.setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);
    } catch (error) {
      setStatus(error.message || "Không thể đăng nhập. Vui lòng thử lại.", true);
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

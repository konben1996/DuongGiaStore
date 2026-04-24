(() => {
  const form = document.getElementById("loginPageForm");
  const status = document.getElementById("loginPageStatus");
  const emailInput = document.getElementById("loginPageEmail");
  const passwordInput = document.getElementById("loginPagePassword");
  const rememberInput = document.getElementById("loginPageRemember");
  const openMobileMenu = document.getElementById("openMobileMenu");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const globalBackdrop = document.getElementById("globalBackdrop");
  const forgotPasswordButton = document.getElementById("openForgotPassword");
  const forgotPasswordModal = document.getElementById("forgotPasswordModal");
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  const forgotPasswordStatus = document.getElementById("forgotPasswordStatus");
  const forgotPasswordEmail = document.getElementById("forgotPasswordEmail");
  const forgotPasswordNewPassword = document.getElementById("forgotPasswordNewPassword");
  const forgotPasswordConfirmPassword = document.getElementById("forgotPasswordConfirmPassword");

  function setStatus(message, isError = false) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  }

  function setForgotStatus(message, isError = false) {
    if (!forgotPasswordStatus) return;
    forgotPasswordStatus.textContent = message;
    forgotPasswordStatus.classList.toggle("is-error", isError);
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

  function openForgotPasswordModal() {
    if (!forgotPasswordModal) return;
    forgotPasswordModal.classList.add("is-open");
    forgotPasswordModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    setForgotStatus("");
    if (emailInput && forgotPasswordEmail) {
      forgotPasswordEmail.value = emailInput.value.trim();
    }
    forgotPasswordNewPassword?.focus();
  }

  function closeForgotPasswordModal() {
    if (!forgotPasswordModal) return;
    forgotPasswordModal.classList.remove("is-open");
    forgotPasswordModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
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

  async function handleForgotPasswordSubmit(event) {
    event.preventDefault();

    const email = forgotPasswordEmail?.value.trim() || "";
    const newPassword = forgotPasswordNewPassword?.value || "";
    const confirmPassword = forgotPasswordConfirmPassword?.value || "";

    if (!email || !newPassword || !confirmPassword) {
      setForgotStatus("Vui lòng nhập đầy đủ thông tin.", true);
      return;
    }

    if (newPassword.length < 6) {
      setForgotStatus("Mật khẩu mới phải có ít nhất 6 ký tự.", true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotStatus("Mật khẩu xác nhận không khớp.", true);
      return;
    }

    setForgotStatus("Đang cập nhật mật khẩu...");

    try {
      const response = await fetch("http://localhost:3001/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không thể cập nhật mật khẩu");
      }

      setForgotStatus("Đổi mật khẩu thành công. Bạn có thể đăng nhập lại.");
      forgotPasswordForm?.reset();
      window.setTimeout(() => {
        closeForgotPasswordModal();
        setStatus("Mật khẩu đã được cập nhật. Hãy đăng nhập lại.");
      }, 1200);
    } catch (error) {
      setForgotStatus(error.message || "Không thể đổi mật khẩu. Vui lòng thử lại.", true);
    }
  }

  openMobileMenu?.addEventListener("click", openDrawer);
  globalBackdrop?.addEventListener("click", closeDrawer);
  forgotPasswordButton?.addEventListener("click", openForgotPasswordModal);

  document.addEventListener("click", (event) => {
    const closeButton = event.target.closest("[data-close-drawer='mobileDrawer']");
    if (closeButton) {
      closeDrawer();
      return;
    }

    const drawerLink = event.target.closest(".mobile-drawer a");
    if (drawerLink) {
      closeDrawer();
      return;
    }

    const closeForgotButton = event.target.closest("[data-close-forgot-password]");
    if (closeForgotButton) {
      closeForgotPasswordModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDrawer();
      closeForgotPasswordModal();
    }
  });

  form?.addEventListener("submit", handleSubmit);
  forgotPasswordForm?.addEventListener("submit", handleForgotPasswordSubmit);
})();

(() => {
  const form = document.getElementById("resetPasswordForm");
  const status = document.getElementById("resetPasswordStatus");
  const emailInput = document.getElementById("resetPasswordEmail");
  const newPasswordInput = document.getElementById("resetPasswordNewPassword");
  const confirmPasswordInput = document.getElementById("resetPasswordConfirmPassword");

  function setStatus(message, isError = false) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const email = emailInput?.value.trim() || "";
    const newPassword = newPasswordInput?.value || "";
    const confirmPassword = confirmPasswordInput?.value || "";

    if (!email || !newPassword || !confirmPassword) {
      setStatus("Vui lòng nhập đầy đủ thông tin.", true);
      return;
    }

    if (newPassword.length < 6) {
      setStatus("Mật khẩu mới phải có ít nhất 6 ký tự.", true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("Mật khẩu xác nhận không khớp.", true);
      return;
    }

    setStatus("Đang cập nhật mật khẩu...");

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

      setStatus("Đặt lại mật khẩu thành công. Đang chuyển về trang đăng nhập...");
      form?.reset();

      window.setTimeout(() => {
        window.location.href = "login.html";
      }, 1400);
    } catch (error) {
      setStatus(error.message || "Không thể đặt lại mật khẩu. Vui lòng thử lại.", true);
    }
  }

  form?.addEventListener("submit", handleSubmit);
})();

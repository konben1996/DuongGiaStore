(() => {
  const headerHTML = `
    <header class="header">
      <div class="container header__main">
        <button class="icon-btn mobile-only" id="openMobileMenu" aria-label="Mở menu">
          ☰
        </button>

        <a href="#" class="logo" aria-label="Đường Gia Phát">
          <img src="assets/logo.svg" alt="Đường Gia Phát" class="logo__image" />
          <div class="logo__text">
            <strong>Đường Gia Phát</strong>
            <span>PC - Laptop cấu hình cao</span>
          </div>
        </a>

        <button
          type="button"
          class="theme-toggle theme-toggle--mobile mobile-only"
          id="themeToggleMobile"
          aria-label="Chuyển giao diện sáng tối"
        >
          <span class="theme-toggle__icon" aria-hidden="true">🌙</span>
        </button>

        <div class="header__actions">
          <div class="user-chip" id="userChip" hidden>
            <span class="user-chip__label">Xin chào</span>
            <strong class="user-chip__name" id="userChipName">
              Khách <span class="user-chip__arrow" aria-hidden="true">⌄</span>
            </strong>
            <button type="button" class="login-btn login-btn--logout" id="logoutBtn">
              Đăng xuất
            </button>
          </div>
          <a
            href="login.html"
            class="login-btn"
            id="openLoginModal"
            aria-label="Đi tới trang đăng nhập"
          >
            Đăng nhập
          </a>
          <button type="button" class="theme-toggle" id="themeToggle" aria-label="Chuyển giao diện sáng tối">
            <span class="theme-toggle__icon" aria-hidden="true">🌙</span>
          </button>
        </div>
      </div>

      <nav class="navbar">
        <div class="container navbar__inner">
          <a href="index.html#home">Trang chủ</a>
          <a href="index.html#featured">Sản phẩm bán chạy</a>
          <a href="index.html#new-products">Sản phẩm mới</a>
          <a href="index.html#promo-products">Khuyến mãi</a>
          <a href="index.html#laptops">Máy tính xách tay</a>
          <a href="index.html#desktop">Máy tính để bàn</a>
          <a href="index.html#gaming">Laptop game & đồ họa</a>
        </div>
      </nav>
    </header>
  `;

  const footerHTML = `
    <footer class="footer">
      <div class="container footer__grid footer__grid--three">
        <div class="footer__col">
          <a class="logo logo--footer" aria-label="Đường Gia Phát">
            <img src="assets/logo.svg" alt="Đường Gia Phát" class="logo__image" />
            <div class="logo__text">
              <strong>Đường Gia Phát</strong>
              <span>Uy tín tạo nên thương hiệu</span>
            </div>
          </a>
          <p>
            Chuyên phân phối laptop, PC gaming, workstation, phụ kiện và linh kiện chính hãng với dịch vụ
            chăm sóc khách hàng tận tâm.
          </p>
        </div>

        <div class="footer__col">
          <h3>Thông tin liên hệ</h3>
          <a href="tel:0000">Hotline: </a>
          <a href="tel:000">Bán lẻ: </a>
          <a href="mailto:">Email: </a>
        </div>
      </div>
      <div class="container footer__bottom">
        <p>© 2026 Đường Gia Phát.</p>
      </div>
    </footer>
  `;

  const loginModalHTML = `
    <div class="modal" id="loginModal" aria-hidden="true">
      <div class="modal__overlay" data-close-modal="loginModal"></div>
      <div class="modal__content modal__content--auth" role="dialog" aria-modal="true" aria-labelledby="loginModalTitle">
        <button type="button" class="modal__close" data-close-modal="loginModal" aria-label="Đóng popup đăng nhập">✕</button>
        <div class="auth-panel">
          <div class="auth-panel__header">
            <span class="section-kicker">Đăng nhập</span>
            <h3 id="loginModalTitle">Chào mừng bạn quay lại</h3>
            <p>Đăng nhập để lưu sản phẩm yêu thích, xem lịch sử và nhận ưu đãi cá nhân hoá.</p>
          </div>
          <form class="auth-form" id="loginForm">
            <label>
              <span>Email</span>
              <input type="email" name="email" id="loginIdentity" autocomplete="username" placeholder="Nhập email" />
            </label>
            <label>
              <span>Mật khẩu</span>
              <input type="password" name="password" id="loginPassword" autocomplete="current-password" placeholder="Nhập mật khẩu" />
            </label>
            <div class="checkbox-line">
              <input type="checkbox" id="rememberLogin" name="rememberLogin" />
              <label for="rememberLogin">Ghi nhớ đăng nhập</label>
            </div>
            <button type="submit" class="btn btn--primary btn--block">Đăng nhập</button>
            <button type="button" class="btn btn--light btn--block" data-close-modal="loginModal">Đóng</button>
            <p class="auth-link">
              Chưa có tài khoản? <a href="register.html" class="auth-link__action" id="openRegisterModal">Đăng ký tài khoản</a>
            </p>
            <p class="auth-status" id="loginStatus" aria-live="polite"></p>
          </form>
        </div>
      </div>
    </div>
  `;

  const registerModalHTML = `
    <div class="modal" id="registerModal" aria-hidden="true">
      <div class="modal__overlay" data-close-modal="registerModal"></div>
      <div class="modal__content modal__content--auth" role="dialog" aria-modal="true" aria-labelledby="registerModalTitle">
        <button type="button" class="modal__close" data-close-modal="registerModal" aria-label="Đóng popup đăng ký">✕</button>
        <div class="auth-panel">
          <div class="auth-panel__header">
            <span class="section-kicker">Đăng ký</span>
            <h3 id="registerModalTitle">Tạo tài khoản mới</h3>
            <p>Tạo tài khoản để mua hàng nhanh hơn và lưu thông tin cá nhân.</p>
          </div>
          <form class="auth-form" id="registerForm">
            <label>
              <span>Họ tên</span>
              <input type="text" name="name" id="registerName" autocomplete="name" placeholder="Nhập họ tên" />
            </label>
            <label>
              <span>Email</span>
              <input type="email" name="email" id="registerEmail" autocomplete="email" placeholder="Nhập email" />
            </label>
            <label>
              <span>Mật khẩu</span>
              <input type="password" name="password" id="registerPassword" autocomplete="new-password" placeholder="Nhập mật khẩu" />
            </label>
            <button type="submit" class="btn btn--primary btn--block">Đăng ký</button>
            <button type="button" class="btn btn--light btn--block" data-close-modal="registerModal">Đóng</button>
            <p class="auth-status" id="registerStatus" aria-live="polite"></p>
          </form>
        </div>
      </div>
    </div>
  `;

  function renderHeader(target = document.getElementById("siteHeader")) {
    if (target) target.innerHTML = headerHTML;
  }

  function renderFooter(target = document.getElementById("siteFooter")) {
    if (target) target.innerHTML = footerHTML;
  }

  function renderLoginModal(target = document.getElementById("siteModal")) {
    if (target) target.innerHTML = loginModalHTML + registerModalHTML;
  }

  function renderLayout() {
    renderHeader();
    renderFooter();
    renderLoginModal();
  }

  window.DuongGiaStoreLayout = {
    renderHeader,
    renderFooter,
    renderLoginModal,
    renderLayout,
  };

  renderLayout();
})();

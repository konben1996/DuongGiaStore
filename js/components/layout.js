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
          <a class="support-pill" href="tel:">
            <span>Hotline</span>
            <strong></strong>
          </a>
          <button type="button" class="theme-toggle" id="themeToggle" aria-label="Chuyển giao diện sáng tối">
            <span class="theme-toggle__icon" aria-hidden="true">🌙</span>
          </button>
        </div>
      </div>

      <nav class="navbar">
        <div class="container navbar__inner">
          <a href="#">Trang chủ</a>
          <a href="#featured">Sản phẩm bán chạy</a>
          <a href="#new-products">Sản phẩm mới</a>
          <a href="#promo-products">Khuyến mãi</a>
          <a href="#laptops">Máy tính xách tay</a>
          <a href="#desktop">Máy tính để bàn</a>
          <a href="#gaming">Laptop game & đồ họa</a>
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

  function renderHeader(target = document.getElementById("siteHeader")) {
    if (target) target.innerHTML = headerHTML;
  }

  function renderFooter(target = document.getElementById("siteFooter")) {
    if (target) target.innerHTML = footerHTML;
  }

  function renderLayout() {
    renderHeader();
    renderFooter();
  }

  window.DuongGiaStoreLayout = {
    renderHeader,
    renderFooter,
    renderLayout,
  };

  renderLayout();
})();

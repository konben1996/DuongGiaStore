const API_BASE_URL = window.API_BASE_URL || window.location.origin;
const productSources = Object.values(window.DuongGiaStoreProducts || {});
const localProducts = productSources.flatMap((source) => source.products || []);
const localProductGalleries = productSources.reduce(
  (acc, source) => Object.assign(acc, source.productGalleries || {}),
  {}
);

const elements = {
  body: document.body,
  adminNavLinks: [...document.querySelectorAll(".admin-nav__link")],
  adminDashboardPanel: document.getElementById("adminDashboardPanel"),
  adminProductsPanel: document.getElementById("adminProductsPanel"),
  adminOrdersPanel: document.getElementById("adminOrdersPanel"),
  adminUsersPanel: document.getElementById("adminUsersPanel"),
  adminMarketingPanel: document.getElementById("adminMarketingPanel"),
  adminSettingsPanel: document.getElementById("adminSettingsPanel"),
  adminTotalProducts: document.getElementById("adminTotalProducts"),
  adminActiveProducts: document.getElementById("adminActiveProducts"),
  adminTotalUsers: document.getElementById("adminTotalUsers"),
  adminTotalOrders: document.getElementById("adminTotalOrders"),
  adminRecentProductName: document.getElementById("adminRecentProductName"),
  adminRecentOrderName: document.getElementById("adminRecentOrderName"),
  adminTopCategory: document.getElementById("adminTopCategory"),
  adminSystemStatus: document.getElementById("adminSystemStatus"),
  adminCategoryGamingLaptop: document.getElementById("adminCategoryGamingLaptop"),
  adminCategoryOfficeLaptop: document.getElementById("adminCategoryOfficeLaptop"),
  adminCategoryGamingPc: document.getElementById("adminCategoryGamingPc"),
  adminCategoryAccessory: document.getElementById("adminCategoryAccessory"),
  adminDashboardProductsTable: document.getElementById("adminDashboardProductsTable"),
  refreshAdminData: document.getElementById("refreshAdminData"),
  openAddProductForm: document.getElementById("openAddProductForm"),
  adminProductModal: document.getElementById("adminProductModal"),
  adminProductForm: document.getElementById("adminProductForm"),
  adminProductName: document.getElementById("adminProductName"),
  adminProductCategory: document.getElementById("adminProductCategory"),
  adminProductPrice: document.getElementById("adminProductPrice"),
  adminProductStock: document.getElementById("adminProductStock"),
  adminProductImage: document.getElementById("adminProductImage"),
  adminProductImageFile: document.getElementById("adminProductImageFile"),
  adminProductImageCategory: document.getElementById("adminProductImageCategory"),
  adminProductStatus: document.getElementById("adminProductStatus"),
  adminProductsTable: document.getElementById("adminProductsTable"),
  adminUsersTable: document.getElementById("adminUsersTable"),
  productSearch: document.getElementById("productSearch"),
  productCategoryFilter: document.getElementById("productCategoryFilter"),
  globalBackdrop: document.getElementById("globalBackdrop"),
};

const state = {
  token: localStorage.getItem("authToken") || sessionStorage.getItem("authToken") || "",
  user: null,
  products: [],
  users: [],
  orders: [],
  filteredProducts: [],
  dashboard: null,
};

function getAuthToken() {
  return localStorage.getItem("authToken") || sessionStorage.getItem("authToken") || state.token || "";
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
  if (elements.globalBackdrop) elements.globalBackdrop.hidden = false;
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
  if (elements.globalBackdrop) elements.globalBackdrop.hidden = true;
}

function setPanelVisibility(panelName) {
  const panels = {
    dashboard: elements.adminDashboardPanel,
    products: elements.adminProductsPanel,
    orders: elements.adminOrdersPanel,
    users: elements.adminUsersPanel,
    marketing: elements.adminMarketingPanel,
    settings: elements.adminSettingsPanel,
  };

  Object.entries(panels).forEach(([name, panel]) => {
    if (!panel) return;
    panel.hidden = name !== panelName;
  });

  elements.adminNavLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.adminTab === panelName);
  });
}

function formatCurrency(value) {
  const amount = Number(value || 0);
  return amount.toLocaleString("vi-VN") + "₫";
}

function categoryLabel(category) {
  const map = {
    "gaming-laptop": "Gaming Laptop",
    "office-laptop": "Office Laptop",
    "gaming-pc": "Gaming PC",
    accessory: "Accessory",
  };

  return map[category] || category || "---";
}

function normalizeProduct(product) {
  const gallery = localProductGalleries[product.id] || [];
  return {
    ...product,
    image: product.image || gallery[0] || "",
    stock: product.stock ?? 0,
    is_active: product.is_active !== false,
  };
}

async function apiFetch(path, options = {}) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

async function verifyAdmin() {
  const token = getAuthToken();
  if (!token) {
    window.location.href = "login.html";
    return false;
  }
  state.token = token;

  try {
    const data = await apiFetch("/api/auth/me");
    state.user = data.user;

    if (!state.user || state.user.role !== "admin") {
      elements.adminSystemStatus.textContent = "Không có quyền truy cập";
      window.location.href = "index.html";
      return false;
    }

    return true;
  } catch (error) {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    window.location.href = "login.html";
    return false;
  }
}

function renderProductsTable() {
  if (!elements.adminProductsTable) return;

  const rows = state.filteredProducts.length ? state.filteredProducts : state.products;

  if (!rows.length) {
    elements.adminProductsTable.innerHTML = `
      <tr>
        <td colspan="6" class="admin-table__empty">Chưa có dữ liệu sản phẩm.</td>
      </tr>
    `;
    return;
  }

  elements.adminProductsTable.innerHTML = rows
    .map(
      (product) => `
        <tr>
          <td>
            <div class="admin-table__product">
              <img src="${product.image || ""}" alt="${product.name || ""}" />
              <strong>${product.name || "---"}</strong>
            </div>
          </td>
          <td>${categoryLabel(product.category)}</td>
          <td>${formatCurrency(product.price)}</td>
          <td>${typeof product.stock === "number" ? product.stock : product.stock || 0}</td>
          <td>
            <span class="admin-badge ${product.is_active === false ? "is-off" : "is-on"}">
              ${product.is_active === false ? "Hidden" : "Active"}
            </span>
          </td>
          <td>
            <button type="button" class="btn btn--light" data-admin-action="edit-product" data-id="${product.id}">
              Sửa
            </button>
            <button type="button" class="btn btn--light" data-admin-action="delete-product" data-id="${product.id}">
              Xoá
            </button>
          </td>
        </tr>
      `
    )
    .join("");
}

function renderUsersTable() {
  if (!elements.adminUsersTable) return;

  const rows = state.users;

  if (!rows.length) {
    elements.adminUsersTable.innerHTML = `
      <tr>
        <td colspan="5" class="admin-table__empty">Chưa có dữ liệu người dùng.</td>
      </tr>
    `;
    return;
  }

  elements.adminUsersTable.innerHTML = rows
    .map(
      (user) => `
        <tr>
          <td>${user.name || "---"}</td>
          <td>${user.email || "---"}</td>
          <td>${user.role || "user"}</td>
          <td>${user.phone || "---"}</td>
          <td>
            <button type="button" class="btn btn--light" data-admin-action="toggle-user-role" data-id="${user.id}">
              Đổi role
            </button>
          </td>
        </tr>
      `
    )
    .join("");
}

function renderOrdersTable() {
  if (!elements.adminOrdersPanel) return;
  const existingTable = document.getElementById("adminOrdersTable");
  if (!existingTable) {
    elements.adminOrdersPanel.querySelector(".admin-settings").innerHTML = `
      <div class="table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody id="adminOrdersTable"></tbody>
        </table>
      </div>
    `;
  }

  const table = document.getElementById("adminOrdersTable");
  if (!table) return;

  if (!state.orders.length) {
    table.innerHTML = `
      <tr>
        <td colspan="5" class="admin-table__empty">Chưa có dữ liệu đơn hàng.</td>
      </tr>
    `;
    return;
  }

  const statusLabel = {
    pending: "Chờ xác nhận",
    shipping: "Đang giao",
    completed: "Hoàn thành",
    cancelled: "Đã huỷ",
  };

  table.innerHTML = state.orders
    .map(
      (order) => `
        <tr>
          <td>${order.code || "---"}</td>
          <td>${order.customer || "---"}</td>
          <td>${formatCurrency(order.total)}</td>
          <td>${statusLabel[order.status] || order.status || "---"}</td>
          <td>${order.createdAt || "---"}</td>
        </tr>
      `
    )
    .join("");
}

function updateSummary() {
  const totalProducts = state.products.length;
  const activeProducts = state.products.filter((product) => product.is_active !== false).length;
  const totalUsers = state.users.length;

  if (elements.adminTotalProducts) elements.adminTotalProducts.textContent = String(totalProducts);
  if (elements.adminActiveProducts) elements.adminActiveProducts.textContent = String(activeProducts);
  if (elements.adminTotalUsers) elements.adminTotalUsers.textContent = String(totalUsers);
  if (elements.adminTotalOrders) elements.adminTotalOrders.textContent = String(state.orders.length);

  if (elements.adminRecentProductName) {
    const recent = state.products[0];
    elements.adminRecentProductName.textContent = recent?.name || "Chưa có dữ liệu";
  }

  if (elements.adminRecentOrderName) {
    const recentOrder = state.orders[0];
    elements.adminRecentOrderName.textContent = recentOrder?.code || "Chưa có dữ liệu";
  }

  if (elements.adminTopCategory) {
    const counts = state.products.reduce((acc, product) => {
      const key = product.category || "unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const topCategory = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    elements.adminTopCategory.textContent = topCategory ? categoryLabel(topCategory[0]) : "---";
  }
}

function filterProducts() {
  const search = (elements.productSearch?.value || "").trim().toLowerCase();
  const category = elements.productCategoryFilter?.value || "all";

  state.filteredProducts = state.products.filter((product) => {
    const matchSearch = !search || (product.name || "").toLowerCase().includes(search);
    const matchCategory = category === "all" || product.category === category;
    return matchSearch && matchCategory;
  });

  renderProductsTable();
}

async function loadDashboardData() {
  if (elements.adminSystemStatus) {
    elements.adminSystemStatus.textContent = "Đang tải dữ liệu...";
  }

  try {
    let products = [];
    try {
      const productsResponse = await apiFetch("/api/admin/products");
      products = Array.isArray(productsResponse.products) ? productsResponse.products.map(normalizeProduct) : [];
    } catch (error) {
      products = localProducts.map(normalizeProduct);
    }

    state.products = products;

    let users = [];
    try {
      const usersResponse = await apiFetch("/api/admin/users");
      users = Array.isArray(usersResponse.users) ? usersResponse.users : [];
    } catch (error) {
      users = state.user ? [state.user] : [];
    }

    state.users = users;
    state.orders = [
      { code: "DH-0001", customer: "Khách hàng A", total: 45990000, status: "pending", createdAt: "2026-04-24" },
      { code: "DH-0002", customer: "Khách hàng B", total: 32990000, status: "shipping", createdAt: "2026-04-23" },
      { code: "DH-0003", customer: "Khách hàng C", total: 1290000, status: "completed", createdAt: "2026-04-22" },
    ];

    state.filteredProducts = [...state.products];

    renderProductsTable();
    renderOrdersTable();
    renderUsersTable();
    updateSummary();

    const categoryCounts = state.products.reduce((acc, product) => {
      const key = product.category || "unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];

    if (elements.adminCategoryGamingLaptop) {
      elements.adminCategoryGamingLaptop.textContent = `${categoryCounts["gaming-laptop"] || 0} sản phẩm`;
    }
    if (elements.adminCategoryOfficeLaptop) {
      elements.adminCategoryOfficeLaptop.textContent = `${categoryCounts["office-laptop"] || 0} sản phẩm`;
    }
    if (elements.adminCategoryGamingPc) {
      elements.adminCategoryGamingPc.textContent = `${categoryCounts["gaming-pc"] || 0} sản phẩm`;
    }
    if (elements.adminCategoryAccessory) {
      elements.adminCategoryAccessory.textContent = `${categoryCounts["accessory"] || 0} sản phẩm`;
    }

    if (elements.adminTotalProducts) {
      elements.adminTotalProducts.textContent = String(state.products.length);
    }
    if (elements.adminActiveProducts) {
      elements.adminActiveProducts.textContent = String(state.products.filter((product) => product.is_active).length);
    }
    if (elements.adminTotalUsers) {
      elements.adminTotalUsers.textContent = String(state.users.length);
    }
    if (elements.adminTotalOrders) {
      elements.adminTotalOrders.textContent = String(state.orders.length);
    }
    if (elements.adminRecentProductName) {
      elements.adminRecentProductName.textContent = state.products[0]?.name || "Chưa có dữ liệu";
    }
    if (elements.adminRecentOrderName) {
      elements.adminRecentOrderName.textContent = state.orders[0]?.code || "Chưa có dữ liệu";
    }
    if (elements.adminTopCategory) {
      elements.adminTopCategory.textContent = topCategory ? categoryLabel(topCategory[0]) : "---";
    }
    if (elements.adminSystemStatus) {
      elements.adminSystemStatus.textContent = "Đang hoạt động";
    }

    if (elements.adminDashboardProductsTable) {
      elements.adminDashboardProductsTable.innerHTML = state.products
        .slice(0, 4)
        .map(
          (product) => `
            <tr>
              <td>${product.name || "---"}</td>
              <td>${categoryLabel(product.category)}</td>
              <td>${formatCurrency(product.price)}</td>
              <td>${typeof product.stock === "number" ? product.stock : product.stock || 0}</td>
            </tr>
          `
        )
        .join("");
    }
  } catch (error) {
    if (elements.adminSystemStatus) {
      elements.adminSystemStatus.textContent = error.message || "Không thể tải dữ liệu";
    }
  }
}

let editingProductId = null;

function openProductForm(product = null) {
  editingProductId = product ? product.id : null;

  if (elements.adminProductForm) {
    elements.adminProductForm.reset();
  }

  if (elements.adminProductImageFile) {
    elements.adminProductImageFile.value = "";
  }
  if (elements.adminProductImageCategory) {
    elements.adminProductImageCategory.value = product?.category || "gaming-laptop";
  }

  if (product) {
    elements.adminProductName.value = product.name || "";
    elements.adminProductCategory.value = product.category || "gaming-laptop";
    elements.adminProductPrice.value = product.price || 0;
    elements.adminProductStock.value = product.stock || 0;
    elements.adminProductImage.value = product.image || "";
    if (elements.adminProductStatus) {
      elements.adminProductStatus.textContent = "Đang chỉnh sửa sản phẩm.";
    }
  } else if (elements.adminProductStatus) {
    elements.adminProductStatus.textContent = "";
  }

  openModal(elements.adminProductModal);
}

function bindEvents() {
  elements.adminNavLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setPanelVisibility(link.dataset.adminTab);
    });
  });

  elements.refreshAdminData?.addEventListener("click", loadDashboardData);
  elements.openAddProductForm?.addEventListener("click", () => openProductForm());

  elements.productSearch?.addEventListener("input", filterProducts);
  elements.productCategoryFilter?.addEventListener("change", filterProducts);

  elements.adminProductForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const selectedFile = elements.adminProductImageFile?.files?.[0] || null;
    const imageDataUrl = selectedFile
      ? await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ""));
          reader.onerror = () => reject(new Error("Không thể đọc file ảnh"));
          reader.readAsDataURL(selectedFile);
        })
      : "";

    const imageCategory = elements.adminProductImageCategory?.value || elements.adminProductCategory?.value || "accessory";

    const payload = {
      name: elements.adminProductName?.value.trim() || "",
      category: elements.adminProductCategory?.value || "accessory",
      price: Number(elements.adminProductPrice?.value || 0),
      stock: Number(elements.adminProductStock?.value || 0),
      image: elements.adminProductImage?.value.trim() || "",
      imageCategory,
      imageDataUrl,
      imageFileName: selectedFile?.name || "",
    };

    try {
      if (elements.adminProductStatus) {
        elements.adminProductStatus.textContent = editingProductId ? "Đang cập nhật sản phẩm..." : "Đang tạo sản phẩm...";
      }

      if (editingProductId) {
        await apiFetch(`/api/admin/products/${editingProductId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/api/admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      if (elements.adminProductStatus) {
        elements.adminProductStatus.textContent = "Lưu sản phẩm thành công.";
      }

      closeModal(elements.adminProductModal);
      await loadDashboardData();
    } catch (error) {
      if (elements.adminProductStatus) {
        elements.adminProductStatus.textContent = error.message || "Không thể lưu sản phẩm";
      }
    }
  });

  document.querySelectorAll("[data-close-modal='adminProductModal']").forEach((button) => {
    button.addEventListener("click", () => closeModal(elements.adminProductModal));
  });

  document.addEventListener("click", async (event) => {
    const actionButton = event.target.closest("[data-admin-action]");
    if (!actionButton) return;

    const action = actionButton.dataset.adminAction;
    const id = actionButton.dataset.id;

    if (action === "edit-product") {
      const product = state.products.find((item) => String(item.id) === String(id));
      if (!product) return;
      openProductForm(product);
      return;
    }

    if (action === "delete-product") {
      const confirmed = window.confirm("Xoá sản phẩm này?");
      if (!confirmed) return;

      try {
        await apiFetch(`/api/admin/products/${id}`, { method: "DELETE" });
        if (elements.adminProductStatus) {
          elements.adminProductStatus.textContent = "Xoá sản phẩm thành công.";
        }
        await loadDashboardData();
      } catch (error) {
        if (elements.adminProductStatus) {
          elements.adminProductStatus.textContent = error.message || "Không thể xoá sản phẩm";
        }
      }
      return;
    }

    if (action === "toggle-user-role") {
      if (elements.adminSystemStatus) {
        elements.adminSystemStatus.textContent = "Chức năng đổi role sẽ được nối vào API ở bước tiếp theo.";
      }
    }
  });

  elements.globalBackdrop?.addEventListener("click", () => {
    closeModal(elements.adminProductModal);
  });
}

async function init() {
  setPanelVisibility("dashboard");
  bindEvents();

  const isAdmin = await verifyAdmin();
  if (!isAdmin) return;

  await loadDashboardData();
}

init();

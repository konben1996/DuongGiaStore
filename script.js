const products = [
  {
    id: "pcap-apollo",
    name: "Máy tính chơi game PCAP Apollo",
    price: 13500000,
    oldPrice: 15500000,
    discount: 13,
    category: "gaming-pc",
    label: "PC Gaming",
    image:
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80",
    stock: "Còn hàng",
    brand: "ASUS",
    summary:
      "Bộ PC gaming tầm trung với hiệu năng ổn định cho eSports, làm việc đa nhiệm và giải trí hằng ngày.",
    specs: [
      "CPU Intel Core i5 thế hệ mới",
      "RAM 16GB DDR4",
      "SSD NVMe 512GB tốc độ cao",
      "Card đồ họa RTX tối ưu gaming",
    ],
    tags: ["bestSeller", "discount"],
  },
  {
    id: "asus-rog-cetra-core",
    name: "Tai nghe Asus ROG Cetra Core",
    price: 990000,
    oldPrice: 1200000,
    discount: 18,
    category: "accessory",
    label: "Phụ kiện",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    stock: "Còn hàng",
    brand: "ASUS",
    summary: "Tai nghe in-ear gaming với âm thanh chi tiết, đeo êm và mic thoại rõ ràng.",
    specs: ["Micro chống ồn", "Jack 3.5mm", "Thiết kế gọn nhẹ", "Tương thích đa nền tảng"],
    tags: ["bestSeller", "discount"],
  },
  {
    id: "asus-proart-17",
    name: "ASUS ProArt StudioBook Pro 17 W700G1T",
    price: 43900000,
    oldPrice: 45600000,
    discount: 4,
    category: "workstation",
    label: "Workstation",
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    stock: "Sẵn showroom",
    brand: "ASUS",
    summary:
      "Laptop đồ họa chuyên nghiệp cho dựng phim, 3D, CAD với màn hình lớn và cấu hình mạnh.",
    specs: ["Màn 17 inch chuẩn màu", "CPU hiệu năng cao", "GPU đồ họa rời", "Thiết kế bền bỉ"],
    tags: ["bestSeller", "newArrival"],
  },
  {
    id: "hp-omen-15",
    name: "HP Omen 15-dh0172TX Gaming Laptop",
    price: 42800000,
    oldPrice: 44600000,
    discount: 7,
    category: "gaming-laptop",
    label: "Laptop Gaming",
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80",
    stock: "Còn hàng",
    brand: "HP",
    summary:
      "Laptop gaming cao cấp cho FPS, AAA và streaming với tản nhiệt mạnh và màn tần số quét cao.",
    specs: ["RTX series", "Màn 144Hz", "Bàn phím RGB", "Tản nhiệt kép"],
    tags: ["bestSeller", "newArrival"],
  },
  {
    id: "asus-tuf-h3",
    name: "Tai nghe Asus TUF H3 Red",
    price: 990000,
    oldPrice: 1200000,
    discount: 18,
    category: "accessory",
    label: "Phụ kiện",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
    stock: "Còn hàng",
    brand: "ASUS",
    summary: "Tai nghe gaming chụp tai chắc chắn, âm bass tốt và mic đàm thoại rõ.",
    specs: ["Thiết kế nhẹ", "Âm thanh vòm", "Tương thích PC/console", "Đệm tai mềm"],
    tags: ["bestSeller", "discount"],
  },
  {
    id: "pcap-styx",
    name: "Máy tính đa tác vụ PCAP Styx",
    price: 13500000,
    oldPrice: 15500000,
    discount: 13,
    category: "gaming-pc",
    label: "PC Đa nhiệm",
    image:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80",
    stock: "Còn hàng",
    brand: "MSI",
    summary:
      "Dòng PC tối ưu làm việc đa nhiệm, học tập, văn phòng nặng và xử lý đồ họa cơ bản.",
    specs: ["CPU Intel Core i5", "RAM 16GB", "SSD 512GB", "Thiết kế gọn gàng"],
    tags: ["bestSeller", "discount"],
  },
  {
    id: "acer-swift-7",
    name: "Acer Swift 7 SF714-52T-7134 Laptop Black",
    price: 48000000,
    oldPrice: 49600000,
    discount: 4,
    category: "office-laptop",
    label: "Laptop Văn Phòng",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
    stock: "Sẵn hàng",
    brand: "ACER",
    summary: "Laptop siêu mỏng nhẹ, sang trọng, phù hợp doanh nhân và công việc di chuyển nhiều.",
    specs: ["Thiết kế siêu mỏng", "Pin lâu", "Màn cảm ứng", "Bảo mật vân tay"],
    tags: ["newArrival"],
  },
  {
    id: "lg-gram-17",
    name: "LG Gram 17Z90N-V.AH75A5 Laptop Silver",
    price: 38000000,
    oldPrice: 39600000,
    discount: 4,
    category: "office-laptop",
    label: "Laptop Văn Phòng",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    stock: "Còn hàng",
    brand: "LG",
    summary:
      "Laptop màn hình lớn nhưng siêu nhẹ, tối ưu nhập liệu, làm việc đa cửa sổ và pin bền bỉ.",
    specs: ["Màn 17 inch", "Trọng lượng nhẹ", "Pin bền", "Thiết kế mỏng"],
    tags: ["bestSeller", "newArrival"],
  },
  {
    id: "asus-vivobook-15",
    name: "ASUS VivoBook 15 A512FA-EJ1281T Laptop",
    price: 13600000,
    oldPrice: 15600000,
    discount: 13,
    category: "office-laptop",
    label: "Laptop Văn Phòng",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    stock: "Còn hàng",
    brand: "ASUS",
    summary: "Laptop văn phòng phổ thông, cân bằng giữa hiệu năng, màn hình và mức giá.",
    specs: ["Màn 15.6 inch", "SSD nhanh", "Thiết kế gọn nhẹ", "Phù hợp học tập"],
    tags: ["discount", "newArrival"],
  },
  {
    id: "ikbc-cd108",
    name: "Bàn phím cơ IKBC CD108 PD Blue Switch",
    price: 990000,
    oldPrice: 1200000,
    discount: 18,
    category: "accessory",
    label: "Phụ kiện",
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
    stock: "Còn hàng",
    brand: "IKBC",
    summary: "Bàn phím cơ gõ sướng, bền bỉ, phù hợp game thủ và người dùng văn phòng thích tactile.",
    specs: ["Blue Switch", "Fullsize 108 phím", "Khung cứng cáp", "Kết nối USB"],
    tags: ["discount", "bestSeller"],
  },
  {
    id: "pcap-iris",
    name: "Máy tính đa tác vụ PCAP Iris",
    price: 23500000,
    oldPrice: 25500000,
    discount: 8,
    category: "gaming-pc",
    label: "PC Đa nhiệm",
    image:
      "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1200&q=80",
    stock: "Còn hàng",
    brand: "INTEL",
    summary:
      "Cấu hình mạnh cho làm việc nặng, chỉnh sửa ảnh, dựng video nhẹ và chiến game phổ biến.",
    specs: ["Core i7", "RAM 32GB", "SSD 1TB", "Card đồ họa rời"],
    tags: ["bestSeller", "discount", "newArrival"],
  },
  {
    id: "acer-predator-helios",
    name: "Acer Predator Helios 300 PH315-52-78HH",
    price: 34500000,
    oldPrice: 35600000,
    discount: 3,
    category: "gaming-laptop",
    label: "Laptop Gaming",
    image:
      "https://images.unsplash.com/photo-1603481546579-65d935ba9cdd?auto=format&fit=crop&w=1200&q=80",
    stock: "Sẵn hàng",
    brand: "ACER",
    summary:
      "Laptop gaming hiệu năng cao với tản tốt, màn đẹp, phù hợp cả chơi game và làm đồ họa.",
    specs: ["CPU Intel Core i7", "RTX series", "Màn 144Hz", "Thiết kế hầm hố"],
    tags: ["newArrival", "bestSeller"],
  },
  {
    id: "msi-modern-15",
    name: "MSI Modern 15 A10M-068VN Laptop",
    price: 16800000,
    oldPrice: 18600000,
    discount: 10,
    category: "office-laptop",
    label: "Laptop Văn Phòng",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    stock: "Còn hàng",
    brand: "MSI",
    summary: "Thiết kế thanh lịch, hiệu năng mượt cho học tập, làm việc văn phòng và sáng tạo nội dung nhẹ.",
    specs: ["Thiết kế kim loại", "Mỏng nhẹ", "SSD tốc độ cao", "Bàn phím full-size"],
    tags: ["discount", "newArrival"],
  },
  {
    id: "rog-zephyrus-m",
    name: "ASUS ROG Zephyrus M GU502GU-AZ090T",
    price: 31600000,
    oldPrice: 34600000,
    discount: 12,
    category: "gaming-laptop",
    label: "Laptop Gaming",
    image:
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1200&q=80",
    stock: "Sẵn hàng",
    brand: "ASUS",
    summary:
      "Laptop gaming mỏng mạnh, cân bằng giữa hiệu năng, ngoại hình cao cấp và trải nghiệm di động.",
    specs: ["Thiết kế mỏng", "RTX series", "Màn 240Hz", "Âm thanh sống động"],
    tags: ["discount", "bestSeller", "newArrival"],
  },
  {
    id: "dxracer-valkyrie",
    name: "Ghế game DXRacer Valkyrie Series GC",
    price: 990000,
    oldPrice: 1200000,
    discount: 18,
    category: "accessory",
    label: "Ghế Gaming",
    image:
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1200&q=80",
    stock: "Còn hàng",
    brand: "DXRACER",
    summary: "Ghế gaming đệm êm, tựa lưng tốt, ngồi lâu thoải mái cho game thủ và streamer.",
    specs: ["Đệm dày", "Ngả lưng linh hoạt", "Khung chắc chắn", "Thiết kế thể thao"],
    tags: ["discount", "newArrival"],
  },
  {
    id: "asus-tuf-fx705",
    name: "ASUS TUF Gaming FX705DT-H7138T",
    price: 42000000,
    oldPrice: 42600000,
    discount: 4,
    category: "gaming-laptop",
    label: "Laptop Gaming",
    image:
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80",
    stock: "Còn hàng",
    brand: "ASUS",
    summary: "Laptop gaming màn lớn, bền bỉ theo chuẩn TUF, phù hợp chiến game và đồ họa.",
    specs: ["Màn lớn", "Card đồ họa rời", "Thiết kế bền", "Bàn phím tối ưu game"],
    tags: ["bestSeller", "newArrival"],
  },
  {
    id: "pcap-poseidon",
    name: "Máy tính chơi game PCAP Poseidon",
    price: 23500000,
    oldPrice: 25500000,
    discount: 8,
    category: "gaming-pc",
    label: "PC Gaming",
    image:
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80",
    stock: "Sẵn cấu hình",
    brand: "NVIDIA",
    summary: "PC gaming hiệu năng cao cho AAA, streaming, thiết kế 2D/3D và nâng cấp linh hoạt.",
    specs: ["Ryzen/Intel tùy chọn", "RAM 32GB", "RTX series", "Tản nhiệt tối ưu"],
    tags: ["discount", "bestSeller"],
  },
  {
    id: "pcap-jupiter",
    name: "Máy tính chơi game PCAP Jupiter",
    price: 20500000,
    oldPrice: 22500000,
    discount: 9,
    category: "gaming-pc",
    label: "PC Gaming",
    image:
      "https://images.unsplash.com/photo-1587202372583-49330a15584d?auto=format&fit=crop&w=1200&q=80",
    stock: "Còn hàng",
    brand: "GIGABYTE",
    summary: "Dòng PC dành cho game thủ cần cấu hình mạnh, ổn định và nâng cấp lâu dài.",
    specs: ["CPU mạnh", "RAM 16GB", "SSD NVMe", "Case kính cường lực"],
    tags: ["discount", "newArrival"],
  },
  {
    id: "asus-strix-ultra",
    name: "Máy tính chơi game PCAP ASUS STRIX ULTRA 1",
    price: 33500000,
    oldPrice: 35500000,
    discount: 6,
    category: "gaming-pc",
    label: "PC Gaming",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80",
    stock: "Sẵn cấu hình",
    brand: "ASUS",
    summary: "Bộ máy gaming cao cấp định hướng eSports và AAA với ngoại hình nổi bật.",
    specs: ["Main ASUS Strix", "RTX series", "RGB đồng bộ", "Tản khí cao cấp"],
    tags: ["newArrival"],
  },
  {
    id: "lg-gram-14",
    name: "LG Gram 14ZD90N-V.AX55A5 Laptop",
    price: 28000000,
    oldPrice: 29600000,
    discount: 6,
    category: "office-laptop",
    label: "Laptop Văn Phòng",
    image:
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=1200&q=80",
    stock: "Còn hàng",
    brand: "LG",
    summary: "Laptop gọn nhẹ cho doanh nhân, người dùng cần pin dài và tính di động cao.",
    specs: ["14 inch", "Pin lâu", "Trọng lượng nhẹ", "Thiết kế tối giản"],
    tags: ["newArrival"],
  },
];

const defaultProductImage =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";
const imagePlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3C/svg%3E";
const productGalleries = {
  "pcap-apollo": [
    "https://images.unsplash.com/photo-1587202372583-49330a15584d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80",
  ],
  "asus-rog-cetra-core": [
    "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
  ],
  "asus-proart-17": [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
  ],
  "hp-omen-15": [
    "https://images.unsplash.com/photo-1603481546579-65d935ba9cdd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80",
  ],
  "asus-tuf-h3": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
  ],
  "pcap-styx": [
    "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80",
  ],
  "acer-swift-7": [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=1200&q=80",
  ],
  "lg-gram-17": [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  ],
  "asus-vivobook-15": [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=1200&q=80",
  ],
  "ikbc-cd108": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
  ],
  "pcap-iris": [
    "https://images.unsplash.com/photo-1587202372583-49330a15584d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80",
  ],
  "acer-predator-helios": [
    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80",
  ],
  "msi-modern-15": [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=1200&q=80",
  ],
  "rog-zephyrus-m": [
    "https://images.unsplash.com/photo-1603481546579-65d935ba9cdd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80",
  ],
  "dxracer-valkyrie": [
    "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
  ],
  "asus-tuf-fx705": [
    "https://images.unsplash.com/photo-1603481546579-65d935ba9cdd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80",
  ],
  "pcap-poseidon": [
    "https://images.unsplash.com/photo-1587202372583-49330a15584d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80",
  ],
  "pcap-jupiter": [
    "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80",
  ],
  "asus-strix-ultra": [
    "https://images.unsplash.com/photo-1587202372583-49330a15584d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80",
  ],
  "lg-gram-14": [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  ],
};

const state = {
  currentSlide: 0,
  currentTab: "bestSeller",
  currentNewProductsTab: "newArrival",
  currentPromoProductsTab: "discount",
  currentCategory: "all",
};

const elements = {
  body: document.body,
  tabProductGrid: document.getElementById("tabProductGrid"),
  productTabs: document.getElementById("productTabs"),
  newProductsTabs: document.getElementById("newProductsTabs"),
  promoProductsTabs: document.querySelector("#promo-products .tabs"),
  categoryButtons: [...document.querySelectorAll("[data-category-filter]")],
  laptopGrid: document.getElementById("laptopGrid"),
  desktopGrid: document.getElementById("desktopGrid"),
  gamingGrid: document.getElementById("gamingGrid"),
  openMobileMenu: document.getElementById("openMobileMenu"),
  mobileDrawer: document.getElementById("mobileDrawer"),
  globalBackdrop: document.getElementById("globalBackdrop"),
  productModal: document.getElementById("productModal"),
  productModalContent: document.getElementById("productModalContent"),
  toast: document.getElementById("toast"),
  backToTop: document.getElementById("backToTop"),
  themeToggle: document.getElementById("themeToggle"),
  themeToggleMobile: document.getElementById("themeToggleMobile"),
  heroSlides: [...document.querySelectorAll(".hero-slide")],
  heroDots: document.getElementById("heroDots"),
  prevSlide: document.getElementById("prevSlide"),
  nextSlide: document.getElementById("nextSlide"),
};

let toastTimer = null;
let sliderTimer = null;
let imageObserver = null;

function formatCurrency(value) {
  return value.toLocaleString("vi-VN") + "₫";
}

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function updateThemeToggle(theme) {
  const toggleButtons = [elements.themeToggle, elements.themeToggleMobile].filter(Boolean);

  toggleButtons.forEach((button) => {
    const icon = button.querySelector(".theme-toggle__icon");
    const text = button.querySelector(".theme-toggle__text");

    if (icon) icon.textContent = theme === "dark" ? "☀️" : "🌙";
    if (text) text.textContent = theme === "dark" ? "Giao diện sáng" : "Giao diện tối";

    button.setAttribute(
      "aria-label",
      theme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"
    );
  });
}

function applyTheme(theme) {
  elements.body.dataset.theme = theme;
  updateThemeToggle(theme);
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const initialTheme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : getSystemTheme();

  applyTheme(initialTheme);

  const handleThemeToggle = () => {
    const nextTheme = elements.body.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  };

  elements.themeToggle?.addEventListener("click", handleThemeToggle);
  elements.themeToggleMobile?.addEventListener("click", handleThemeToggle);

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener?.("change", (event) => {
    const userSavedTheme = localStorage.getItem("theme");
    if (userSavedTheme === "dark" || userSavedTheme === "light") return;
    applyTheme(event.matches ? "dark" : "light");
  });
}

function findProductById(productId) {
  return products.find((product) => product.id === productId);
}

function getProductImage(product) {
  return product.image || defaultProductImage;
}

function getProductGallery(product) {
  const extraImages = productGalleries[product.id] || [];

  return [getProductImage(product), ...extraImages]
    .filter(Boolean)
    .filter((image, index, list) => list.indexOf(image) === index)
    .slice(0, 4);
}

function getFilteredProducts(baseList = products) {
  return baseList.filter((product) => {
    return state.currentCategory === "all" || product.category === state.currentCategory;
  });
}

function getProductsByTag(tagName) {
  return getFilteredProducts().filter((product) => product.tags.includes(tagName));
}

function getTabProducts() {
  return getProductsByTag(state.currentTab);
}

function createProductCard(product) {
  return `
    <article class="product-card">
      <div class="product-card__discount">-${product.discount}%</div>
      <div class="product-card__media">
        <img
          src="${imagePlaceholder}"
          data-src="${getProductImage(product)}"
          alt="${product.name}"
          loading="lazy"
          decoding="async"
          fetchpriority="low"
          referrerpolicy="no-referrer"
          class="lazy-product-image"
        />
      </div>
      <span class="product-card__category">${product.label}</span>
      <h3 class="product-card__title">${product.name}</h3>
      <div class="product-card__pricing">
        <span class="product-card__current">Liên Hệ</span>
      </div>
      <div class="product-card__actions">
        <button type="button" class="btn-quick" data-action="quick-view" data-id="${product.id}">
          Xem nhanh
        </button>
      </div>
    </article>
  `;
}

function initLazyImages() {
  const lazyImages = [...document.querySelectorAll(".lazy-product-image[data-src]")];

  if (!lazyImages.length) return;

  if (!("IntersectionObserver" in window)) {
    lazyImages.forEach((image) => {
      image.src = image.dataset.src;
      image.removeAttribute("data-src");
    });
    return;
  }

  if (imageObserver) imageObserver.disconnect();

  imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const image = entry.target;
        const source = image.dataset.src;

        if (source) {
          image.src = source;
          image.removeAttribute("data-src");
        }

        observer.unobserve(image);
      });
    },
    {
      rootMargin: "250px 0px",
    }
  );

  lazyImages.forEach((image) => imageObserver.observe(image));
}

function renderGrid(target, list) {
  if (!target) return;

  if (!list.length) {
    target.innerHTML = `
      <div class="empty-state">
        Không tìm thấy sản phẩm phù hợp. Hãy thử đổi từ khóa hoặc danh mục khác.
      </div>
    `;
    return;
  }

  target.innerHTML = list.map(createProductCard).join("");
  initLazyImages();
}

function renderTabProducts() {
  renderGrid(elements.tabProductGrid, getTabProducts());
}

function renderCategorySections() {
  const laptopProducts = getFilteredProducts().filter((product) =>
    ["gaming-laptop", "workstation", "office-laptop"].includes(product.category)
  );
  const desktopProducts = getFilteredProducts().filter((product) => product.category === "gaming-pc");
  const gamingProducts = getFilteredProducts().filter((product) =>
    ["gaming-laptop", "workstation", "gaming-pc"].includes(product.category)
  );

  renderGrid(elements.laptopGrid, laptopProducts.slice(0, 10));
  renderGrid(elements.desktopGrid, desktopProducts.slice(0, 10));
  renderGrid(elements.gamingGrid, gamingProducts.slice(0, 10));

  const newProductsGrid = document.getElementById("newProductsGrid");
  if (newProductsGrid) {
    const newProducts = getProductsByTag(state.currentNewProductsTab).slice(0, 12);
    renderGrid(newProductsGrid, newProducts);

  }

  const promoProductsGrid = document.getElementById("promoProductsGrid");
  if (promoProductsGrid) {
    renderGrid(promoProductsGrid, getProductsByTag(state.currentPromoProductsTab).slice(0, 12));
  }
}



function showToast(message) {
  elements.toast.setAttribute("role", "status");
  elements.toast.setAttribute("aria-live", "polite");
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 2400);
}

function setOverlayVisibility() {
  const hasDrawerOpen = elements.mobileDrawer.classList.contains("is-open");
  const hasModalOpen = elements.productModal.classList.contains("is-open");

  elements.globalBackdrop.hidden = !hasDrawerOpen;
  elements.body.classList.toggle("is-locked", hasDrawerOpen || hasModalOpen);
}

function openDrawer(drawer) {
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  setOverlayVisibility();
}

function closeDrawer(drawer) {
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  setOverlayVisibility();
}

function closeAllDrawers() {
  closeDrawer(elements.mobileDrawer);
}

function openModal(modal) {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  setOverlayVisibility();
}

function closeModal(modal) {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  setOverlayVisibility();
}

function openProductModal(productId) {
  const product = findProductById(productId);
  if (!product) return;

  const gallery = getProductGallery(product);
  const featuredImage = gallery[0];

  elements.productModalContent.innerHTML = `
    <div class="product-modal__gallery">
      <div class="product-modal__visual">
        <img
          src="${featuredImage}"
          alt="${product.name}"
          loading="lazy"
          decoding="async"
          referrerpolicy="no-referrer"
          id="productModalMainImage"
        />
      </div>
      <div class="product-modal__thumbs">
        ${gallery
          .map(
            (image, index) => `
              <button
                type="button"
                class="product-modal__thumb ${index === 0 ? "is-active" : ""}"
                data-gallery-image="${image}"
                aria-label="Xem ảnh ${index + 1} của ${product.name}"
              >
                <img
                  src="${image}"
                  alt="${product.name} - ảnh ${index + 1}"
                  loading="lazy"
                  decoding="async"
                  referrerpolicy="no-referrer"
                />
              </button>
            `
          )
          .join("")}
      </div>
    </div>
    <div class="product-modal__info">
      <span class="section-kicker">${product.label}</span>
      <h3>${product.name}</h3>
      <p>${product.summary}</p>
      <div class="product-modal__price">Liên Hệ</div>
      <div class="product-modal__meta">
        <span><strong>Thương hiệu:</strong> ${product.brand}</span>
        <span><strong>Tình trạng:</strong> ${product.stock}</span>
        <span><strong>Ưu đãi:</strong> Giảm ${product.discount}% so với giá niêm yết</span>
      </div>
      <ul class="support-list">
        ${product.specs.map((spec) => `<li>${spec}</li>`).join("")}
      </ul>
      <div class="hero-slide__actions">
        <button type="button" class="btn btn--light" data-close-modal="productModal">
          Đóng
        </button>
      </div>
    </div>
  `;

  openModal(elements.productModal);
}

function activateTab(tabName) {
  state.currentTab = tabName;
  elements.productTabs?.querySelectorAll(".tab-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tabName);
  });
  renderTabProducts();
}

function activateNewProductsTab(tabName) {
  state.currentNewProductsTab = tabName;
  elements.newProductsTabs?.querySelectorAll(".tab-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tabName);
  });
  renderCategorySections();
}

function activatePromoProductsTab(tabName) {
  state.currentPromoProductsTab = tabName;
  elements.promoProductsTabs?.querySelectorAll(".tab-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tabName);
  });
  renderCategorySections();
}

function setCategory(category) {
  state.currentCategory = category;
  elements.categoryButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.categoryFilter === category);
  });

  renderTabProducts();
  renderCategorySections();
}

function setSlide(index) {
  const total = elements.heroSlides.length;
  state.currentSlide = (index + total) % total;

  elements.heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === state.currentSlide);
  });

  [...elements.heroDots.querySelectorAll(".hero-dot")].forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === state.currentSlide);
  });
}

function buildHeroDots() {
  elements.heroDots.innerHTML = elements.heroSlides
    .map(
      (_, index) =>
        `<button type="button" class="hero-dot ${index === 0 ? "is-active" : ""}" data-slide="${index}" aria-label="Đi tới slide ${index + 1}"></button>`
    )
    .join("");
}

function startAutoSlide() {
  stopAutoSlide();
  sliderTimer = setInterval(() => {
    setSlide(state.currentSlide + 1);
  }, 4500);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopAutoSlide();
  } else {
    startAutoSlide();
  }
});


function stopAutoSlide() {
  if (sliderTimer) clearInterval(sliderTimer);
}

function handleSpecialNav(targetId, anchor) {
  if (!targetId) return false;

  const target = document.getElementById(targetId);
  if (!target) return false;

  const headerOffset = window.innerWidth <= 768 ? 96 : 128;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

  document.querySelectorAll(".drawer__nav a").forEach((link) => {
    link.classList.toggle("is-active", link === anchor);
  });

  window.scrollTo({
    top: Math.max(targetTop, 0),
    behavior: "smooth",
  });

  return true;
}

function initEvents() {
  elements.productTabs?.addEventListener("click", (event) => {
    const button = event.target.closest(".tab-btn");
    if (!button) return;
    activateTab(button.dataset.tab);
  });

  elements.newProductsTabs?.addEventListener("click", (event) => {
    const button = event.target.closest(".tab-btn");
    if (!button) return;
    activateNewProductsTab(button.dataset.tab);
  });

  elements.promoProductsTabs?.addEventListener("click", (event) => {
    const button = event.target.closest(".tab-btn");
    if (!button) return;
    activatePromoProductsTab(button.dataset.tab);
  });

  elements.categoryButtons.forEach((button) => {
    button.addEventListener("click", () => setCategory(button.dataset.categoryFilter));
  });

  elements.openMobileMenu?.addEventListener("click", () => openDrawer(elements.mobileDrawer));

  elements.globalBackdrop?.addEventListener("click", closeAllDrawers);

  document.querySelectorAll("[data-close-drawer]").forEach((button) => {
    button.addEventListener("click", () => {
      const drawer = document.getElementById(button.dataset.closeDrawer);
      if (drawer) closeDrawer(drawer);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const modal = document.getElementById(button.dataset.closeModal);
      if (modal) closeModal(modal);
    });
  });

  document.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    if (actionButton) {
      const { action, id } = actionButton.dataset;

      if (action === "quick-view") {
        openProductModal(id);
        return;
      }
    }

    const modalCloser = event.target.closest("[data-close-modal]");
    if (modalCloser) {
      const modal = document.getElementById(modalCloser.dataset.closeModal);
      if (modal) closeModal(modal);
    }

    const galleryThumb = event.target.closest("[data-gallery-image]");
    if (galleryThumb) {
      const mainImage = document.getElementById("productModalMainImage");
      const nextImage = galleryThumb.dataset.galleryImage;

      if (mainImage && nextImage) {
        mainImage.src = nextImage;
        document.querySelectorAll(".product-modal__thumb").forEach((thumb) => {
          thumb.classList.toggle("is-active", thumb === galleryThumb);
        });
      }

      return;
    }

    const anchor = event.target.closest('a[href^="#"]');
    if (anchor) {
      const targetId = anchor.getAttribute("href").slice(1);
      if (handleSpecialNav(targetId, anchor)) {
        event.preventDefault();
        closeDrawer(elements.mobileDrawer);
      }
    }
  });

  elements.prevSlide?.addEventListener("click", () => {
    setSlide(state.currentSlide - 1);
    startAutoSlide();
  });

  elements.nextSlide?.addEventListener("click", () => {
    setSlide(state.currentSlide + 1);
    startAutoSlide();
  });

  elements.heroDots?.addEventListener("click", (event) => {
    const dot = event.target.closest(".hero-dot");
    if (!dot) return;
    setSlide(Number(dot.dataset.slide));
    startAutoSlide();
  });



  elements.backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllDrawers();
      closeModal(elements.productModal);
    }
  });

  window.addEventListener("scroll", () => {
    const show = window.scrollY > 480;
    elements.backToTop.style.opacity = show ? "1" : "0.65";
  });
}

function init() {
  initTheme();
  buildHeroDots();
  renderTabProducts();
  renderCategorySections();
  initEvents();
  startAutoSlide();
}

init();

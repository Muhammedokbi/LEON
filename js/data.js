var panelVisible = false;
var currentSearch = '';
var currentLang = 'tr';
var distros = [];

const desktopEnvs = {
  gnome: { id: 'gnome', name: 'GNOME', image: 'assets/gnome_ui_1780217245350.png', tr: { desc: 'Modern, minimalist ve dikkat dağıtmayan iş akışına sahip popüler masaüstü.' }, en: { desc: 'Modern, minimalist, and distraction-free workflow popular desktop.' } },
  kde: { id: 'kde', name: 'KDE Plasma', image: 'assets/kde_ui_1780217258002.png', tr: { desc: 'Sınırsız özelleştirme seçeneği ve şık animasyonlarıyla güçlü bir arayüz.' }, en: { desc: 'A powerful interface with limitless customization options and sleek animations.' } },
  xfce: { id: 'xfce', name: 'XFCE', image: 'assets/xfce_ui_1780217271074.png', tr: { desc: 'Hafif, hızlı ve düşük sistem kaynakları tüketen geleneksel bir yapı.' }, en: { desc: 'A lightweight, fast, and low-resource consuming traditional structure.' } },
  cinnamon: { id: 'cinnamon', name: 'Cinnamon', image: 'assets/cinnamon_ui_1780217283630.png', tr: { desc: "Windows'a benzer, klasik, kullanımı kolay ve zarif tasarım." }, en: { desc: 'Classic, easy to use, and elegant design similar to Windows.' } },
  cosmic: { id: 'cosmic', name: 'COSMIC', image: 'assets/cosmic_ui_1780217297229.png', tr: { desc: 'Geliştiriciler için üretilmiş, pencere döşeme (tiling) destekli yeni nesil masaüstü.' }, en: { desc: 'Next-gen desktop with tiling support built for developers.' } }
};

const i18n = {
  tr: {
    search_placeholder: "dağıtım ara...",
    hero_tag: "Documentation System v5.0 (Encyclopedia Edition)",
    hero_title_sub: "Linux Enterprise Open Network",
    explore_btn: "Dağıtımları Keşfet",
    panel_title: "Linux <span>Dağıtımları</span>",
    results_found: "dağıtım bulundu",
    back_btn: "Ana Sayfaya Dön",
    no_results: "Sonuç bulunamadı",
    no_results_desc: "Arama teriminizi değiştirmeyi deneyin.",
    modal_founded: "yılından beri",
    modal_founder: "Kuruluş / Ekip",
    modal_base: "Temel",
    modal_pkg: "Paket Yöneticisi",
    modal_desktop: "Masaüstü",
    modal_history: "Tarihçe",
    modal_usecases: "Kimler Kullanır?",
    modal_install: "Adım Adım Kurulum Rehberi",
    modal_select_de: "Masaüstü Ortamınızı Seçin",
    pros: "Artıları",
    cons: "Eksileri",
    why_choose: "Neden Seçilmeli?",
    terminal_commands: "Sık Kullanılan Komutlar",
    loading: "Veritabanına Bağlanılıyor...",
    error: "Sunucuya bağlanılamadı. Lütfen 'python3 backend/server.py' komutuyla sunucuyu başlatın."
  },
  en: {
    search_placeholder: "search distro...",
    hero_tag: "Documentation System v5.0 (Encyclopedia Edition)",
    hero_title_sub: "Linux Enterprise Open Network",
    explore_btn: "Explore Distros",
    panel_title: "Linux <span>Distributions</span>",
    results_found: "distros found",
    back_btn: "Back to Home",
    no_results: "No results found",
    no_results_desc: "Try changing your search term.",
    modal_founded: "since",
    modal_founder: "Organization",
    modal_base: "Base",
    modal_pkg: "Package Manager",
    modal_desktop: "Desktop",
    modal_history: "History",
    modal_usecases: "Who uses it?",
    modal_install: "Step-by-Step Installation Guide",
    modal_select_de: "Select Desktop Environment",
    pros: "Pros",
    cons: "Cons",
    why_choose: "Why Choose This?",
    terminal_commands: "Common Commands",
    loading: "Connecting to Database...",
    error: "Failed to connect to server. Please run 'python3 backend/server.py'."
  }
};

async function fetchDistros() {
  try {
    const res = await fetch('http://localhost:8080/api/distros');
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    
    // Mutate data for search tags
    data.forEach(d => {
      d.tr.tags = [d.tr.badge, d.base, d.desktop];
      d.en.tags = [d.en.badge, d.base, d.desktop];
    });
    
    distros = data;
    return true;
  } catch (error) {
    console.error("API Error:", error);
    return false;
  }
}

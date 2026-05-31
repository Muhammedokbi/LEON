var panelVisible = false;
var currentSearch = '';
var currentLang = 'tr';
var distros = [];

const desktopEnvs = {
  gnome: { id: 'gnome', name: 'GNOME', image: 'assets/GNOME_Shell.png', tr: { desc: 'Modern, minimalist ve dikkat dağıtmayan iş akışına sahip popüler masaüstü.' }, en: { desc: 'Modern, minimalist, and distraction-free workflow popular desktop.' } },
  kde: { id: 'kde', name: 'KDE Plasma', image: 'assets/KDE_Plasma_6.4.5_Light.png', tr: { desc: 'Sınırsız özelleştirme seçeneği ve şık animasyonlarıyla güçlü bir arayüz.' }, en: { desc: 'A powerful interface with limitless customization options and sleek animations.' } },
  xfce: { id: 'xfce', name: 'XFCE', image: 'assets/XFCE_4.20.png', tr: { desc: 'Hafif, hızlı ve düşük sistem kaynakları tüketen geleneksel bir yapı.' }, en: { desc: 'A lightweight, fast, and low-resource consuming traditional structure.' } },
  cinnamon: { id: 'cinnamon', name: 'Cinnamon', image: 'assets/Cinnamon_4.4.8_on_Linux_Mint_19.3.png', tr: { desc: "Windows'a benzer, klasik, kullanımı kolay ve zarif tasarım." }, en: { desc: 'Classic, easy to use, and elegant design similar to Windows.' } },
  cosmic: { id: 'cosmic', name: 'COSMIC', image: 'assets/COSMIC_Epoch_1.0.0_alpha_with_apps.png', tr: { desc: 'Geliştiriciler için üretilmiş, pencere döşeme (tiling) destekli yeni nesil masaüstü.' }, en: { desc: 'Next-gen desktop with tiling support built for developers.' } },
  mate: { id: 'mate', name: 'MATE', image: 'assets/Ubuntu_MATE_16.04_screenshot.png', tr: { desc: 'GNOME 2 tabanlı, geleneksel ve hafif masaüstü ortamı.' }, en: { desc: 'GNOME 2-based traditional and lightweight desktop environment.' } },
  jwm: { id: 'jwm', name: 'JWM', image: 'assets/PuppyLinuxWary511.png', tr: { desc: 'Ultra hafif pencere yöneticisi, düşük kaynaklı sistemler için ideal.' }, en: { desc: 'Ultra lightweight window manager, ideal for low-resource systems.' } }
};

const i18n = {
  tr: {
    search_placeholder: "dağıtım ara...",
    hero_tag: "Documentation System v6.0 (Encyclopedia Edition)",
    hero_title_sub: "Linux Kurumsal Açık Ağ",
    explore_btn: "Dağıtımları Keşfet",
    panel_title: "Linux <span>Dağıtımları</span>",
    results_found: "dağıtım bulundu",
    back_btn: "Ana Sayfaya Dön",
    no_results: "Sonuç bulunamadı",
    no_results_desc: "Arama teriminizi değiştirmeyi deneyin.",
    download_iso: "İndir (ISO)",
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
    hero_tag: "Documentation System v6.0 (Encyclopedia Edition)",
    hero_title_sub: "Linux Enterprise Open Network",
    explore_btn: "Explore Distros",
    panel_title: "Linux <span>Distributions</span>",
    results_found: "distros found",
    back_btn: "Back to Home",
    no_results: "No results found",
    no_results_desc: "Try changing your search term.",
    download_iso: "Download (ISO)",
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
    const res = await fetch('backend/distros.json');
    if (!res.ok) throw new Error("Ağ hatası: " + res.status);
    distros = await res.json();
    
    // Mutate data for search tags
    distros.forEach(d => {
      d.tr.tags = [d.tr.badge, d.tr.base || '', d.tr.desktop || ''].filter(Boolean);
      d.en.tags = [d.en.badge, d.en.base || '', d.en.desktop || ''].filter(Boolean);
    });
    
    return true;
  } catch (error) {
    console.error("API Error:", error);
    return false;
  }
}

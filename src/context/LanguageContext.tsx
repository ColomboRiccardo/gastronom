"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "fr" | "it" | "ru";

interface LanguageInfo {
  code: Language;
  label: string;
  flag: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

// Translation keys
const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.products": "Products",
    "nav.categories": "Categories",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.signin": "Sign In",
    "nav.create_account": "Create Account",
    "hero.shop_now": "Shop Now",
    "hero.learn_more": "Learn More",
    "cart.title": "Cart",
    "cart.empty": "Your cart is empty",
    "cart.checkout": "Checkout",
    "cart.total": "Total",
    "cart.subtotal": "Subtotal",
    "cart.continue_shopping": "Continue Shopping",
    "products.title": "Our Products",
    "products.search": "Search products...",
    "products.no_results": "No products found",
    "products.add_to_cart": "Add to Cart",
    "products.filters": "Filters",
    "about.title": "About Us",
    "account.profile": "Profile",
    "account.orders": "Orders",
    "account.wishlist": "Wishlist",
    "account.settings": "Settings",
    "account.dashboard": "Dashboard",
    "account.all_orders": "All Orders",
    "account.products": "Products",
    "account.customers": "Customers",
    "settings.preferences": "Preferences",
    "settings.email_notifications": "Email Notifications",
    "settings.language": "Language",
    "settings.currency": "Currency",
    "settings.account": "Account",
    "settings.change_password": "Change Password",
    "settings.privacy": "Privacy Settings",
    "settings.logout": "Log Out",
    "footer.rights": "All rights reserved",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.products": "Produits",
    "nav.categories": "Catégories",
    "nav.about": "À propos",
    "nav.contact": "Contact",
    "nav.signin": "Connexion",
    "nav.create_account": "Créer un compte",
    "hero.shop_now": "Acheter",
    "hero.learn_more": "En savoir plus",
    "cart.title": "Panier",
    "cart.empty": "Votre panier est vide",
    "cart.checkout": "Commander",
    "cart.total": "Total",
    "cart.subtotal": "Sous-total",
    "cart.continue_shopping": "Continuer vos achats",
    "products.title": "Nos Produits",
    "products.search": "Rechercher des produits...",
    "products.no_results": "Aucun produit trouvé",
    "products.add_to_cart": "Ajouter au panier",
    "products.filters": "Filtres",
    "about.title": "À propos de nous",
    "account.profile": "Profil",
    "account.orders": "Commandes",
    "account.wishlist": "Liste de souhaits",
    "account.settings": "Paramètres",
    "account.dashboard": "Tableau de bord",
    "account.all_orders": "Toutes les commandes",
    "account.products": "Produits",
    "account.customers": "Clients",
    "settings.preferences": "Préférences",
    "settings.email_notifications": "Notifications par e-mail",
    "settings.language": "Langue",
    "settings.currency": "Devise",
    "settings.account": "Compte",
    "settings.change_password": "Changer le mot de passe",
    "settings.privacy": "Paramètres de confidentialité",
    "settings.logout": "Déconnexion",
    "footer.rights": "Tous droits réservés",
  },
  it: {
    "nav.home": "Home",
    "nav.products": "Prodotti",
    "nav.categories": "Categorie",
    "nav.about": "Chi siamo",
    "nav.contact": "Contatti",
    "nav.signin": "Accedi",
    "nav.create_account": "Crea account",
    "hero.shop_now": "Acquista ora",
    "hero.learn_more": "Scopri di più",
    "cart.title": "Carrello",
    "cart.empty": "Il tuo carrello è vuoto",
    "cart.checkout": "Checkout",
    "cart.total": "Totale",
    "cart.subtotal": "Subtotale",
    "cart.continue_shopping": "Continua lo shopping",
    "products.title": "I Nostri Prodotti",
    "products.search": "Cerca prodotti...",
    "products.no_results": "Nessun prodotto trovato",
    "products.add_to_cart": "Aggiungi al carrello",
    "products.filters": "Filtri",
    "about.title": "Chi Siamo",
    "account.profile": "Profilo",
    "account.orders": "Ordini",
    "account.wishlist": "Lista desideri",
    "account.settings": "Impostazioni",
    "account.dashboard": "Dashboard",
    "account.all_orders": "Tutti gli ordini",
    "account.products": "Prodotti",
    "account.customers": "Clienti",
    "settings.preferences": "Preferenze",
    "settings.email_notifications": "Notifiche email",
    "settings.language": "Lingua",
    "settings.currency": "Valuta",
    "settings.account": "Account",
    "settings.change_password": "Cambia password",
    "settings.privacy": "Impostazioni privacy",
    "settings.logout": "Esci",
    "footer.rights": "Tutti i diritti riservati",
  },
  ru: {
    "nav.home": "Главная",
    "nav.products": "Продукты",
    "nav.categories": "Категории",
    "nav.about": "О нас",
    "nav.contact": "Контакты",
    "nav.signin": "Войти",
    "nav.create_account": "Создать аккаунт",
    "hero.shop_now": "Купить",
    "hero.learn_more": "Узнать больше",
    "cart.title": "Корзина",
    "cart.empty": "Ваша корзина пуста",
    "cart.checkout": "Оформить заказ",
    "cart.total": "Итого",
    "cart.subtotal": "Подитог",
    "cart.continue_shopping": "Продолжить покупки",
    "products.title": "Наши Продукты",
    "products.search": "Поиск продуктов...",
    "products.no_results": "Продукты не найдены",
    "products.add_to_cart": "В корзину",
    "products.filters": "Фильтры",
    "about.title": "О Нас",
    "account.profile": "Профиль",
    "account.orders": "Заказы",
    "account.wishlist": "Избранное",
    "account.settings": "Настройки",
    "account.dashboard": "Панель управления",
    "account.all_orders": "Все заказы",
    "account.products": "Продукты",
    "account.customers": "Клиенты",
    "settings.preferences": "Предпочтения",
    "settings.email_notifications": "Email уведомления",
    "settings.language": "Язык",
    "settings.currency": "Валюта",
    "settings.account": "Аккаунт",
    "settings.change_password": "Изменить пароль",
    "settings.privacy": "Настройки конфиденциальности",
    "settings.logout": "Выйти",
    "footer.rights": "Все права защищены",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("app-language");
      if (saved && ["en", "fr", "it", "ru"].includes(saved)) {
        return saved as Language;
      }
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

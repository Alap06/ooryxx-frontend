# 👁️ Guide Visuel - Ooryxx Frontend

## 🎨 Aperçu des Fonctionnalités

### 1. 🌍 Sélecteur de Langue

```
┌─────────────────────────────────────┐
│  🌐 Français ▼                      │
├─────────────────────────────────────┤
│  🇫🇷 Français                 ✓    │
│  🇬🇧 English                       │
│  🇹🇳 العربية                       │
└─────────────────────────────────────┘
```

**Emplacement**: Header, en haut à droite  
**Action**: Clic pour ouvrir, sélectionner une langue  
**Effet**: Interface traduite instantanément + RTL automatique pour l'arabe

---

### 2. 🎨 Sélecteur de Thème

```
┌─────────────────────────────────────┐
│  Choisir un thème                   │
├─────────────────────────────────────┤
│  ┌──────┐  ┌──────┐                │
│  │ 🔵🟣 │  │ 🔵🔴 │  Bleu Classique│
│  └──────┘  └──────┘  ✓ Actif       │
│                                     │
│  ┌──────┐  ┌──────┐                │
│  │ 🔵🔵 │  │ 🟣🟣 │  Océan         │
│  └──────┘  └──────┘                │
│                                     │
│  ┌──────┐  ┌──────┐                │
│  │ 🟣🟣 │  │ 🟢🟢 │  Violet Moderne│
│  └──────┘  └──────┘                │
├─────────────────────────────────────┤
│  🌙 Mode Sombre              ✓     │
└─────────────────────────────────────┘
```

**Emplacement**: Header, à côté du sélecteur de langue  
**Action**: Clic pour ouvrir, sélectionner un thème  
**Effet**: Couleurs changées instantanément sur toute l'interface

---

### 3. 📱 Header Responsive

#### Desktop (> 1024px)
```
┌─────────────────────────────────────────────────────────────┐
│ Ooryxx  🔍 [Rechercher...]  🌐 FR  🎨  🛒(3)  👤  Logout   │
└─────────────────────────────────────────────────────────────┘
```

#### Tablet (768px - 1024px)
```
┌──────────────────────────────────────────┐
│ Ooryxx  🔍 [Rechercher...]  🌐 🎨 🛒 👤  │
└──────────────────────────────────────────┘
```

#### Mobile (< 768px)
```
┌─────────────────────────┐
│ Ooryxx    🌐 🎨 🛒(3)   │
├─────────────────────────┤
│ 🔍 [Rechercher...]      │
└─────────────────────────┘
```

---

### 4. 🎨 Thèmes Disponibles

#### Bleu Classique (Défaut)
```css
Primary:   #3b82f6 ████████
Secondary: #6366f1 ████████
Accent:    #f97316 ████████
Background: Blanc
```

#### Océan
```css
Primary:   #0ea5e9 ████████
Secondary: #06b6d4 ████████
Accent:    #f59e0b ████████
Background: Blanc
```

#### Violet Moderne
```css
Primary:   #8b5cf6 ████████
Secondary: #a78bfa ████████
Accent:    #ec4899 ████████
Background: Blanc
```

#### Vert Nature
```css
Primary:   #10b981 ████████
Secondary: #34d399 ████████
Accent:    #f59e0b ████████
Background: Blanc
```

#### Mode Sombre
```css
Primary:   #60a5fa ████████
Secondary: #818cf8 ████████
Accent:    #fb923c ████████
Background: #0f172a (Noir)
Text: Blanc
```

---

### 5. 🌐 Direction RTL (Arabe)

#### LTR (Français/English)
```
┌─────────────────────────────────┐
│ Logo              Menu    👤    │
├─────────────────────────────────┤
│ Texte aligné à gauche           │
│ ➡️ Direction de lecture          │
└─────────────────────────────────┘
```

#### RTL (العربية)
```
┌─────────────────────────────────┐
│    👤    Menu              Logo │
├─────────────────────────────────┤
│           Texte aligné à droite │
│          ⬅️ Direction de lecture │
└─────────────────────────────────┘
```

---

### 6. 🛒 Badge Panier Animé

```
Sans articles:
🛒

Avec articles:
🛒
 ❸  ← Badge rouge avec nombre
```

---

### 7. 🔔 Notifications Toast

#### Succès
```
┌────────────────────────────────┐
│ ✓ Produit ajouté au panier !   │
└────────────────────────────────┘
```

#### Erreur
```
┌────────────────────────────────┐
│ ✗ Erreur lors de l'ajout       │
└────────────────────────────────┘
```

#### Info
```
┌────────────────────────────────┐
│ ℹ Connectez-vous pour continuer│
└────────────────────────────────┘
```

#### Avertissement
```
┌────────────────────────────────┐
│ ⚠ Stock limité                 │
└────────────────────────────────┘
```

---

### 8. 📱 Layout Général

```
┌──────────────────────────────────────┐
│           HEADER                      │ ← Sticky
│  Logo | Search | Lang | Theme | Cart │
├──────────────────────────────────────┤
│           NAVBAR                      │ ← Sticky
│  Home | Shop | Deals | Vendors       │
├──────────────────────────────────────┤
│                                       │
│           MAIN CONTENT                │
│                                       │
│         (Pages dynamiques)            │
│                                       │
│                                       │
│                                       │
│                                       │
├──────────────────────────────────────┤
│           FOOTER                      │
│  Links | Newsletter | Social         │
└──────────────────────────────────────┘
```

---

### 9. 🎯 Composants Interactifs

#### Product Card
```
┌─────────────────────┐
│  [Image Produit]    │
│                     │
│  Titre du produit   │
│  ★★★★☆ (4.5)       │
│  49.99 TND          │
│  ┌─────────────────┐│
│  │ ➕ PANIER       ││ ← Hover effect
│  └─────────────────┘│
│  ❤️                 │ ← Wishlist
└─────────────────────┘
```

#### Search Bar avec Autocomplete
```
┌────────────────────────────────┐
│ 🔍 Rechercher des produits...  │
└────────────────────────────────┘
     ↓ (pendant la saisie)
┌────────────────────────────────┐
│ 📱 iPhone 13                   │
│ 💻 MacBook Pro                 │
│ ⌚ Apple Watch                  │
│ 🎧 AirPods Pro                 │
└────────────────────────────────┘
```

---

### 10. 🔐 Modal Authentification

```
┌─────────────────────────────────┐
│ ✕                               │
│                                 │
│    CONNEXION À OORYXX           │
│                                 │
│  📧 Email                       │
│  ┌───────────────────────────┐ │
│  │                           │ │
│  └───────────────────────────┘ │
│                                 │
│  🔒 Mot de passe               │
│  ┌───────────────────────────┐ │
│  │                           │ │
│  └───────────────────────────┘ │
│                                 │
│  ☐ Se souvenir de moi          │
│                                 │
│  ┌───────────────────────────┐ │
│  │    SE CONNECTER           │ │
│  └───────────────────────────┘ │
│                                 │
│  Pas de compte? Inscrivez-vous │
│                                 │
│  ────── OU ──────              │
│                                 │
│  [Google] [Facebook]           │
│                                 │
└─────────────────────────────────┘
```

---

### 11. 🎨 Animations

#### Hover Effect - Boutons
```
Normal:   [BOUTON]
Hover:    [🔵BOUTON] ← Couleur + Scale
```

#### Loading Spinner
```
     ⟳
   Chargement...
```

#### Shimmer Loading (Skeleton)
```
████████████▒▒▒▒▒▒▒▒
███████▒▒▒▒▒▒▒▒▒▒▒▒▒
████████████▒▒▒▒▒▒▒▒
     ↑
  Animation de shimmer
```

---

### 12. 📊 Dashboard Vendeur

```
┌─────────────────────────────────────────┐
│  Dashboard Vendeur                       │
├──────────┬──────────┬──────────┬─────────┤
│ 💰 Ventes│ 📦 Orders│ 📦 Prods │ 📊 Rev. │
│  15,250€ │    142   │    56    │ +12.5%  │
└──────────┴──────────┴──────────┴─────────┘

┌─────────────────────────────────────────┐
│  Graphique des Ventes                    │
│                                          │
│    █                                     │
│    █     █                               │
│  █ █   █ █     █                         │
│  █ █ █ █ █   █ █     █                   │
│  █ █ █ █ █ █ █ █   █ █                   │
│ ─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─                   │
│  J F M A M J J A S O N                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Commandes Récentes                      │
├────┬───────────┬─────────┬──────────────┤
│ #  │ Client    │ Montant │ Statut       │
├────┼───────────┼─────────┼──────────────┤
│ 01 │ C-XXX     │  49.99€ │ 🟢 Livré     │
│ 02 │ C-YYY     │  89.99€ │ 🟡 En cours  │
│ 03 │ C-ZZZ     │ 129.99€ │ 🔴 En attente│
└────┴───────────┴─────────┴──────────────┘
```

---

### 13. 🔍 Filtres Produits

```
┌─────────────────────┐
│  FILTRES            │
├─────────────────────┤
│  Prix               │
│  ├─────●──────────┤ │
│  0€        500€     │
│                     │
│  Catégories         │
│  ☐ Électronique    │
│  ☑ Mode            │
│  ☐ Maison          │
│                     │
│  Marques            │
│  ☐ Apple           │
│  ☑ Samsung         │
│  ☐ Sony            │
│                     │
│  Note               │
│  ☐ ★★★★★          │
│  ☑ ★★★★☆ et +     │
│  ☐ ★★★☆☆ et +     │
│                     │
│  [APPLIQUER]        │
└─────────────────────┘
```

---

### 14. 🛒 Panier Slide-in

```
                    ┌──────────────────┐
                    │ MON PANIER    ✕  │
                    ├──────────────────┤
                    │ [IMG] Produit 1  │
                    │ 49.99€    [-][2][+]│
                    │                  │
                    │ [IMG] Produit 2  │
                    │ 89.99€    [-][1][+]│
                    ├──────────────────┤
                    │ Sous-total       │
                    │ 139.98€          │
                    │                  │
                    │ Livraison        │
                    │ 5.00€            │
                    │                  │
                    │ TOTAL            │
                    │ 144.98€          │
                    ├──────────────────┤
                    │ [COMMANDER]      │
                    └──────────────────┘
```

---

## 🎨 Palette de Couleurs Détaillée

### Primaires
```
primary-50:  #eff6ff  ▓▓▓ Très clair
primary-100: #dbeafe  ▓▓▓
primary-200: #bfdbfe  ▓▓▓
primary-300: #93c5fd  ▓▓▓
primary-400: #60a5fa  ▓▓▓
primary-500: #3b82f6  ███ Base
primary-600: #2563eb  ███
primary-700: #1d4ed8  ███
primary-800: #1e40af  ███
primary-900: #1e3a8a  ███ Très foncé
```

### Neutres
```
neutral-50:  #f8fafc  ░░░ Très clair
neutral-100: #f1f5f9  ░░░
neutral-200: #e2e8f0  ░░░
neutral-300: #cbd5e1  ▒▒▒
neutral-400: #94a3b8  ▒▒▒
neutral-500: #64748b  ▓▓▓ Base
neutral-600: #475569  ▓▓▓
neutral-700: #334155  ███
neutral-800: #1e293b  ███
neutral-900: #0f172a  ███ Très foncé
```

---

## 📐 Responsive Breakpoints

```
Mobile:         320px - 767px   📱
Tablet:         768px - 1023px  📱
Desktop:        1024px - 1279px 💻
Large Desktop:  1280px+         🖥️
```

### Comportements Responsive

#### Navigation
- **Mobile**: Menu hamburger
- **Tablet**: Menu horizontal condensé
- **Desktop**: Menu horizontal complet

#### Grille Produits
- **Mobile**: 1 colonne
- **Tablet**: 2 colonnes
- **Desktop**: 4 colonnes

#### Sidebar Filtres
- **Mobile**: Slide-in drawer
- **Tablet**: Slide-in drawer
- **Desktop**: Sidebar fixe

---

## 🎬 Animations et Transitions

### Durées
```
Fast:   150ms  - Hovers, tooltips
Normal: 250ms  - Modals, dropdowns
Slow:   350ms  - Page transitions
```

### Types
```
fade-in:    Apparition en fondu
slide-up:   Glissement vers le haut
slide-down: Glissement vers le bas
shimmer:    Effet de chargement brillant
bounce:     Rebond léger
pulse:      Pulsation
```

---

## 📱 Icônes (Lucide React)

```
🏠 Home         ➡️ Home
🛍️ ShoppingBag  ➡️ Products
🛒 ShoppingCart ➡️ Cart
👤 User         ➡️ Profile
🔍 Search       ➡️ Recherche
🌐 Globe        ➡️ Langue
🎨 Palette      ➡️ Thème
🌙 Moon         ➡️ Dark Mode
☀️ Sun          ➡️ Light Mode
❤️ Heart        ➡️ Wishlist
⭐ Star         ➡️ Rating
📦 Package      ➡️ Orders
💳 CreditCard   ➡️ Payment
🔔 Bell         ➡️ Notifications
⚙️ Settings     ➡️ Paramètres
```

---

## 🎯 États Interactifs

### Boutons
```
Default:  [BOUTON]
Hover:    [BOUTON]  ← Couleur + échelle
Active:   [BOUTON]  ← Enfoncé
Disabled: [BOUTON]  ← Grisé
Loading:  [⟳ BOUTON]
```

### Inputs
```
Default:  [_____________]
Focus:    [_____________]  ← Bordure bleue
Error:    [_____________]  ← Bordure rouge
Success:  [_____________]  ← Bordure verte
Disabled: [_____________]  ← Grisé
```

---

## 💡 Tips UI/UX

### Contraste
- Texte sur fond blanc: #0f172a
- Texte sur fond sombre: #f1f5f9
- Ratio minimum: 4.5:1 (WCAG AA)

### Espacements
- Entre éléments: 16px (1rem)
- Entre sections: 32px (2rem)
- Padding conteneurs: 24px (1.5rem)

### Tailles de Police
- Titre principal: 2.5rem (40px)
- Titre section: 2rem (32px)
- Sous-titre: 1.5rem (24px)
- Corps: 1rem (16px)
- Petit: 0.875rem (14px)

### Coins Arrondis
- Petits: 0.5rem (8px) - Boutons, badges
- Moyens: 0.75rem (12px) - Cards, inputs
- Grands: 1rem (16px) - Modals, containers

---

**Ce guide visuel vous aide à comprendre l'interface et les interactions !** 🎨

---

_Pour plus de détails techniques, consultez IMPLEMENTATION_GUIDE.md_

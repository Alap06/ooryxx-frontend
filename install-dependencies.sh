#!/bin/bash

echo "🚀 Installation des dépendances Frontend Ooryxx..."
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher un message de succès
success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Fonction pour afficher un message d'info
info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Fonction pour afficher un message d'avertissement
warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez installer Node.js et npm d'abord."
    exit 1
fi

success "npm trouvé: $(npm -v)"
echo ""

# Installation des dépendances i18n
info "Installation des dépendances i18n..."
npm install i18next react-i18next i18next-browser-languagedetector
success "Dépendances i18n installées"
echo ""

# Installation de lucide-react pour les icônes
info "Installation de lucide-react..."
npm install lucide-react
success "lucide-react installé"
echo ""

# Installation des types TypeScript (optionnel mais recommandé)
info "Installation des types TypeScript..."
npm install --save-dev @types/react @types/react-dom @types/node
success "Types TypeScript installés"
echo ""

# Vérifier si toutes les dépendances principales sont installées
info "Vérification des dépendances principales..."

dependencies=(
    "react"
    "react-dom"
    "react-router-dom"
    "axios"
    "react-toastify"
    "@mui/material"
    "formik"
    "yup"
    "swiper"
)

for dep in "${dependencies[@]}"; do
    if npm list "$dep" &> /dev/null; then
        success "$dep ✓"
    else
        warning "$dep manquant - Installation..."
        npm install "$dep"
    fi
done

echo ""
success "✨ Installation terminée !"
echo ""

# Créer le fichier .env s'il n'existe pas
if [ ! -f .env ]; then
    info "Création du fichier .env..."
    cat > .env << EOL
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_STRIPE_KEY=your_stripe_key_here
EOL
    success "Fichier .env créé"
else
    warning "Fichier .env existe déjà"
fi

echo ""
echo "📋 Prochaines étapes:"
echo "   1. Vérifier le fichier .env et ajouter vos clés API"
echo "   2. Lancer le serveur de développement: npm start"
echo "   3. Ouvrir http://localhost:3000 dans votre navigateur"
echo ""
echo "📚 Consultez QUICK_START.md pour plus d'informations"
echo ""
success "Prêt à démarrer ! 🎉"

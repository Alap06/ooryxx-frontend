# Script d'installation des dependances Frontend Ooryxx (PowerShell)

Write-Host "Installation des dependances Frontend Ooryxx..." -ForegroundColor Cyan
Write-Host ""

# Fonction pour afficher un message de succes
function Write-Success {
    param($Message)
    Write-Host "[OK] $Message" -ForegroundColor Green
}

# Fonction pour afficher un message d'info
function Write-Info {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

# Fonction pour afficher un message d'avertissement
function Write-Warning-Custom {
    param($Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

# Verifier si npm est installe
try {
    $npmVersion = npm -v
    Write-Success "npm trouve: $npmVersion"
    Write-Host ""
} catch {
    Write-Host "[ERROR] npm n'est pas installe. Veuillez installer Node.js et npm d'abord." -ForegroundColor Red
    exit 1
}

# Installation des dependances i18n
Write-Info "Installation des dependances i18n..."
npm install i18next react-i18next i18next-browser-languagedetector
Write-Success "Dependances i18n installees"
Write-Host ""

# Installation de lucide-react pour les icones
Write-Info "Installation de lucide-react..."
npm install lucide-react
Write-Success "lucide-react installe"
Write-Host ""

# Installation des types TypeScript (optionnel mais recommande)
Write-Info "Installation des types TypeScript..."
npm install --save-dev @types/react @types/react-dom @types/node
Write-Success "Types TypeScript installes"
Write-Host ""

# Verifier les dependances principales
Write-Info "Verification des dependances principales..."

$dependencies = @(
    "react",
    "react-dom",
    "react-router-dom",
    "axios",
    "react-toastify",
    "@mui/material",
    "formik",
    "yup",
    "swiper"
)

foreach ($dep in $dependencies) {
    try {
        $null = npm list $dep 2>&1
        Write-Success "$dep OK"
    } catch {
        Write-Warning-Custom "$dep manquant - Installation..."
        npm install $dep
    }
}

Write-Host ""
Write-Success "Installation terminee!"
Write-Host ""

# Creer le fichier .env s'il n'existe pas
if (-not (Test-Path .env)) {
    Write-Info "Creation du fichier .env..."
    @"
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_STRIPE_KEY=your_stripe_key_here
"@ | Out-File -FilePath .env -Encoding UTF8
    Write-Success "Fichier .env cree"
} else {
    Write-Warning-Custom "Fichier .env existe deja"
}

Write-Host ""
Write-Host "Prochaines etapes:" -ForegroundColor Cyan
Write-Host "   1. Verifier le fichier .env et ajouter vos cles API"
Write-Host "   2. Lancer le serveur de developpement: npm start"
Write-Host "   3. Ouvrir http://localhost:3000 dans votre navigateur"
Write-Host ""
Write-Host "Consultez QUICK_START.md pour plus d'informations"
Write-Host ""
Write-Success "Pret a demarrer!"

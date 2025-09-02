#!/bin/bash

echo "🚀 Démarrage du serveur CloudStack Portal..."
echo "📋 Configuration:"
echo "   - Port: ${PORT:-3001}"
echo "   - Mode: CloudStack uniquement (sans base de données)"
echo "   - API: Directement connecté à CloudStack"
echo ""

# Vérifier que le fichier .env existe
if [ ! -f .env ]; then
    echo "❌ Erreur: Fichier .env non trouvé !"
    echo "💡 Créez d'abord votre fichier .env avec vos clés CloudStack"
    exit 1
fi

# Vérifier la configuration CloudStack
echo "🔍 Vérification de la configuration CloudStack..."
if grep -q "CLOUDSTACK_API_KEY" .env && grep -q "CLOUDSTACK_SECRET_KEY" .env; then
    echo "✅ Clés API CloudStack trouvées"
else
    echo "❌ Erreur: Clés API CloudStack manquantes dans .env"
    exit 1
fi

# Démarrer le serveur
echo ""
echo "🌐 Démarrage du serveur..."
node server-cloudstack.js

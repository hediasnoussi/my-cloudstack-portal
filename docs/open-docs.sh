#!/bin/bash

# Script pour ouvrir la documentation CloudStack Portal
# Usage: ./open-docs.sh [option]

echo "📚 Documentation CloudStack Portal"
echo "=================================="
echo ""

case "$1" in
    "index"|"")
        echo "🎯 Index de la Documentation"
        echo "   Fichier: INDEX.md"
        echo "   Description: Navigation rapide et recherche par sujet"
        echo ""
        echo "📖 Contenu:"
        echo "   - Navigation rapide"
        echo "   - Recherche par sujet"
        echo "   - Checklist de déploiement"
        echo "   - Problèmes courants"
        echo "   - Support et contact"
        ;;
    "guide"|"integration")
        echo "🔧 Guide d'Intégration CloudStack"
        echo "   Fichier: CLOUDSTACK_INTEGRATION_GUIDE.md"
        echo "   Description: Documentation complète de l'intégration"
        echo ""
        echo "📖 Contenu:"
        echo "   - Architecture de l'intégration"
        echo "   - Configuration backend et frontend"
        echo "   - API endpoints détaillés"
        echo "   - Maintenance et dépannage"
        echo "   - Sécurité et bonnes pratiques"
        echo "   - Monitoring et alertes"
        ;;
    "quick"|"start")
        echo "🚀 Guide de Démarrage Rapide"
        echo "   Fichier: QUICK_START_CLOUDSTACK.md"
        echo "   Description: Commandes et opérations courantes"
        echo ""
        echo "📖 Contenu:"
        echo "   - Démarrage des services"
        echo "   - Opérations courantes"
        echo "   - Dépannage rapide"
        echo "   - Monitoring rapide"
        echo "   - Mise à jour"
        ;;
    "config"|"example")
        echo "⚙️ Exemples de Configuration"
        echo "   Fichier: CONFIGURATION_EXAMPLE.md"
        echo "   Description: Configurations types et exemples"
        echo ""
        echo "📖 Contenu:"
        echo "   - Configuration backend"
        echo "   - Configuration frontend"
        echo "   - Variables d'environnement"
        echo "   - Configuration production"
        echo "   - Sécurité et monitoring"
        ;;
    "all")
        echo "📚 Tous les fichiers de documentation:"
        echo ""
        echo "1. INDEX.md - Index de la documentation"
        echo "2. README.md - Guide principal"
        echo "3. CLOUDSTACK_INTEGRATION_GUIDE.md - Guide d'intégration"
        echo "4. QUICK_START_CLOUDSTACK.md - Démarrage rapide"
        echo "5. CONFIGURATION_EXAMPLE.md - Exemples de configuration"
        ;;
    "help"|"-h"|"--help")
        echo "Usage: ./open-docs.sh [option]"
        echo ""
        echo "Options:"
        echo "  index, ''     - Afficher l'index de la documentation"
        echo "  guide         - Afficher le guide d'intégration"
        echo "  quick         - Afficher le guide de démarrage rapide"
        echo "  config        - Afficher les exemples de configuration"
        echo "  all           - Lister tous les fichiers"
        echo "  help          - Afficher cette aide"
        echo ""
        echo "Exemples:"
        echo "  ./open-docs.sh"
        echo "  ./open-docs.sh quick"
        echo "  ./open-docs.sh config"
        ;;
    *)
        echo "❌ Option inconnue: $1"
        echo "   Utilisez './open-docs.sh help' pour voir les options disponibles"
        ;;
esac

echo ""
echo "📁 Dossier: $(pwd)"
echo "🔗 Ouvrir dans l'éditeur: code ."
echo "🌐 Ouvrir dans le navigateur: xdg-open ."

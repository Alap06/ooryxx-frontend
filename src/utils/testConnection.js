/**
 * Utilitaire pour tester la connexion Frontend → Backend
 * Utilisez cette fonction pour vérifier que tout fonctionne correctement
 */

import { api, apiService, endpoints } from '../services/api';

export const testBackendConnection = async () => {
  console.log('%c🧪 Test de connexion Frontend → Backend', 'color: #3b82f6; font-size: 16px; font-weight: bold');
  console.log('━'.repeat(50));
  
  const results = {
    totalTests: 0,
    passed: 0,
    failed: 0,
    errors: []
  };

  // Test 1: Health Check
  try {
    results.totalTests++;
    console.log('Test 1: Health Check Backend...');
    const response = await fetch('http://localhost:5000/health');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend actif:', data);
      results.passed++;
    } else {
      throw new Error(`Status: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Health Check échoué:', error.message);
    results.failed++;
    results.errors.push({ test: 'Health Check', error: error.message });
  }

  // Test 2: Service API configuré
  try {
    results.totalTests++;
    console.log('Test 2: Configuration du Service API...');
    
    if (apiService && apiService.baseURL) {
      console.log('✅ Service API configuré:', apiService.baseURL);
      results.passed++;
    } else {
      throw new Error('Service API non configuré');
    }
  } catch (error) {
    console.error('❌ Service API non configuré:', error.message);
    results.failed++;
    results.errors.push({ test: 'Service API', error: error.message });
  }

  // Test 3: Endpoints définis
  try {
    results.totalTests++;
    console.log('Test 3: Vérification des Endpoints...');
    
    const endpointCount = Object.keys(endpoints).length;
    if (endpointCount > 0) {
      console.log(`✅ ${endpointCount} groupes d'endpoints configurés`);
      results.passed++;
    } else {
      throw new Error('Aucun endpoint configuré');
    }
  } catch (error) {
    console.error('❌ Endpoints non configurés:', error.message);
    results.failed++;
    results.errors.push({ test: 'Endpoints', error: error.message });
  }

  // Test 4: Variable d'environnement
  try {
    results.totalTests++;
    console.log('Test 4: Variables d\'environnement...');
    
    const apiUrl = process.env.REACT_APP_API_URL;
    if (apiUrl) {
      console.log('✅ REACT_APP_API_URL configurée:', apiUrl);
      results.passed++;
    } else {
      throw new Error('REACT_APP_API_URL non définie');
    }
  } catch (error) {
    console.error('❌ Variable d\'environnement manquante:', error.message);
    results.failed++;
    results.errors.push({ test: 'Environment', error: error.message });
  }

  // Test 5: Test Produits (si backend disponible)
  try {
    results.totalTests++;
    console.log('Test 5: Endpoint Produits...');
    
    const products = await apiService.get(endpoints.products.list);
    console.log('✅ Endpoint produits fonctionnel, produits récupérés:', products?.length || 0);
    results.passed++;
  } catch (error) {
    console.error('⚠️  Endpoint produits non disponible (normal si le backend n\'est pas encore implémenté):', error.message);
    // Ne pas compter comme échec critique
  }

  // Résumé
  console.log('━'.repeat(50));
  console.log('%c📊 Résumé des Tests', 'color: #3b82f6; font-size: 14px; font-weight: bold');
  console.log(`Total: ${results.totalTests} tests`);
  console.log(`%c✅ Réussis: ${results.passed}`, 'color: #22c55e');
  console.log(`%c❌ Échoués: ${results.failed}`, 'color: #ef4444');
  
  if (results.errors.length > 0) {
    console.log('%c⚠️  Erreurs:', 'color: #f59e0b');
    results.errors.forEach((err, index) => {
      console.log(`  ${index + 1}. ${err.test}: ${err.error}`);
    });
  }

  console.log('━'.repeat(50));
  
  if (results.failed === 0) {
    console.log('%c🎉 Tous les tests critiques sont passés!', 'color: #22c55e; font-size: 14px; font-weight: bold');
    return true;
  } else {
    console.log('%c❌ Certains tests ont échoué. Vérifiez la configuration.', 'color: #ef4444; font-size: 14px; font-weight: bold');
    return false;
  }
};

// Fonction pour afficher les informations de configuration
export const showConfiguration = () => {
  console.log('%c⚙️  Configuration Actuelle', 'color: #3b82f6; font-size: 16px; font-weight: bold');
  console.log('━'.repeat(50));
  console.log('Frontend URL:', window.location.origin);
  console.log('Backend URL:', process.env.REACT_APP_API_URL || 'Non configuré');
  console.log('Socket URL:', process.env.REACT_APP_SOCKET_URL || 'Non configuré');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('━'.repeat(50));
};

// Fonction pour tester l'authentification
export const testAuth = async (email = 'test@example.com', password = 'password123') => {
  console.log('%c🔐 Test d\'authentification', 'color: #3b82f6; font-size: 14px; font-weight: bold');
  
  try {
    const response = await apiService.post(endpoints.auth.login, {
      email,
      password
    });
    
    console.log('✅ Authentification réussie');
    console.log('Token:', response.token?.substring(0, 20) + '...');
    console.log('User:', response.user);
    return true;
  } catch (error) {
    console.error('❌ Authentification échouée:', error.message);
    return false;
  }
};

// Export par défaut
export default {
  testBackendConnection,
  showConfiguration,
  testAuth
};

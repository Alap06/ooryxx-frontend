import React, { useState, useEffect } from 'react';
import {
  BugAntIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  XCircleIcon,
  ClockIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import Logo from '../data/images/Logo.png';

const ErrorLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const loadLogs = () => {
    try {
      const errorLogs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      const appErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      const allLogs = [...errorLogs, ...appErrors].sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      setLogs(allLogs);
    } catch (error) {
      console.error('Erreur lors du chargement des logs:', error);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    let filtered = [...logs];

    // Filtre par type
    if (filter === 'network') {
      filtered = filtered.filter(log => log.status !== undefined);
    } else if (filter === 'app') {
      filtered = filtered.filter(log => log.componentStack !== undefined);
    }

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(log =>
        JSON.stringify(log).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  }, [logs, filter, searchTerm]);

  const clearLogs = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer tous les logs ?')) {
      localStorage.removeItem('error_logs');
      localStorage.removeItem('app_errors');
      setLogs([]);
      setFilteredLogs([]);
    }
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `error-logs-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getErrorTypeColor = (log) => {
    if (log.componentStack) return 'bg-error-100 text-error-800';
    if (log.status >= 500) return 'bg-warning-100 text-warning-800';
    if (log.status === 404) return 'bg-info-100 text-info-800';
    if (log.status === 401 || log.status === 403) return 'bg-accent-100 text-accent-800';
    return 'bg-neutral-100 text-neutral-800';
  };

  const getErrorTypeName = (log) => {
    if (log.componentStack) return 'Erreur Application';
    if (log.status >= 500) return 'Erreur Serveur';
    if (log.status === 404) return 'Non Trouvé';
    if (log.status === 401) return 'Non Authentifié';
    if (log.status === 403) return 'Accès Refusé';
    if (log.status === 0) return 'Erreur Réseau';
    return 'Erreur API';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <img src={Logo} alt="OORYXX" className="h-12 w-auto" />
              <div>
                <h1 className="text-3xl font-black text-neutral-800 flex items-center">
                  <BugAntIcon className="w-8 h-8 mr-3 text-error-500" />
                  Journal des Erreurs
                </h1>
                <p className="text-neutral-600 mt-1">
                  Suivi et analyse des erreurs de l'application
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="bg-neutral-100 px-4 py-2 rounded-lg font-semibold text-neutral-700">
                {filteredLogs.length} erreur{filteredLogs.length > 1 ? 's' : ''}
              </span>
              <button
                onClick={exportLogs}
                disabled={logs.length === 0}
                className="flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                <span>Exporter</span>
              </button>
              <button
                onClick={clearLogs}
                disabled={logs.length === 0}
                className="flex items-center space-x-2 bg-error-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-error-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrashIcon className="w-5 h-5" />
                <span>Effacer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <FunnelIcon className="w-5 h-5 text-neutral-600" />
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${filter === 'all'
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setFilter('app')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${filter === 'app'
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                >
                  Application
                </button>
                <button
                  onClick={() => setFilter('network')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${filter === 'network'
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                >
                  Réseau
                </button>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Rechercher dans les logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Logs List */}
        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <BugAntIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-neutral-600 mb-2">
                Aucune erreur trouvée
              </h3>
              <p className="text-neutral-500">
                {logs.length === 0
                  ? "Aucune erreur n'a été enregistrée"
                  : "Aucune erreur ne correspond à vos filtres"}
              </p>
            </div>
          ) : (
            filteredLogs.map((log, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedLog(selectedLog === index ? null : index)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getErrorTypeColor(log)}`}>
                          {getErrorTypeName(log)}
                        </span>
                        {log.status && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700">
                            {log.status}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-neutral-800 mb-2">
                        {log.message || 'Erreur inconnue'}
                      </h3>

                      <div className="flex items-center space-x-4 text-sm text-neutral-600">
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-4 h-4" />
                          <span>{new Date(log.timestamp).toLocaleString('fr-FR')}</span>
                        </div>
                        {log.userAgent && (
                          <div className="flex items-center space-x-1">
                            <ComputerDesktopIcon className="w-4 h-4" />
                            <span className="truncate max-w-xs">
                              {log.userAgent.split('(')[1]?.split(')')[0] || 'Navigateur inconnu'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button className="text-neutral-400 hover:text-neutral-600 transition-colors">
                      <XCircleIcon className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Details (expanded) */}
                  {selectedLog === index && (
                    <div className="mt-6 pt-6 border-t border-neutral-200">
                      <div className="space-y-4">
                        {log.url && (
                          <div>
                            <h4 className="text-sm font-bold text-neutral-700 mb-1">URL:</h4>
                            <p className="text-sm text-neutral-600 bg-neutral-50 p-2 rounded break-all">
                              {log.url}
                            </p>
                          </div>
                        )}

                        {log.stack && (
                          <div>
                            <h4 className="text-sm font-bold text-neutral-700 mb-1">Stack Trace:</h4>
                            <pre className="text-xs text-green-400 bg-neutral-900 p-4 rounded-lg overflow-x-auto">
                              {log.stack}
                            </pre>
                          </div>
                        )}

                        {log.componentStack && (
                          <div>
                            <h4 className="text-sm font-bold text-neutral-700 mb-1">Component Stack:</h4>
                            <pre className="text-xs text-yellow-400 bg-neutral-900 p-4 rounded-lg overflow-x-auto">
                              {log.componentStack}
                            </pre>
                          </div>
                        )}

                        {log.data && (
                          <div>
                            <h4 className="text-sm font-bold text-neutral-700 mb-1">Données supplémentaires:</h4>
                            <pre className="text-xs text-neutral-700 bg-neutral-50 p-4 rounded-lg overflow-x-auto">
                              {JSON.stringify(log.data, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorLogs;

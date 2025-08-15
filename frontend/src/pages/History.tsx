import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trash2, Eye, FileText, Loader, AlertCircle } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { useToast } from '../components/Toast';

interface HistoryItem {
  id: string;
  createdAt: string;
  role: string;
  score: number;
}

interface HistoryDetail {
  id: string;
  createdAt: string;
  resumePreview?: string;
  jobTitle?: string;
  score: number;
  matchedSkills: string[];
  improvementAreas: string[];
  highlights: string[];
}

export function History() {
  const { showToast } = useToast();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await mockApi.getHistory();
      setItems(response.items);
    } catch (error) {
      showToast('error', 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const detail = await mockApi.getHistoryItem(id);
      setSelectedItem(detail);
    } catch (error) {
      showToast('error', 'Failed to load analysis details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this analysis?')) return;
    
    try {
      await mockApi.deleteHistoryItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
      showToast('success', 'Analysis deleted successfully');
    } catch (error) {
      showToast('error', 'Failed to delete analysis');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analysis History</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Review your past resume analyses and track your improvements over time.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No analyses yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start by analyzing your resume to build your history.
          </p>
          <Link
            to="/tailor"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <FileText className="h-4 w-4 mr-2" />
            Analyze Resume
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* History List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Analyses</h2>
            
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => loadDetail(item.id)}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.role}
                      </h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreBadgeColor(item.score)}`}>
                        {item.score}%
                      </span>
                      
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            loadDetail(item.id);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail View */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Analysis Details</h2>
            
            {detailLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                <Loader className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto" />
              </div>
            ) : selectedItem ? (
              <div className="space-y-4">
                {/* Score Overview */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedItem.jobTitle}
                    </h3>
                    <span className={`text-2xl font-bold ${getScoreColor(selectedItem.score)}`}>
                      {selectedItem.score}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Analyzed on {formatDate(selectedItem.createdAt)}
                  </p>
                </div>

                {/* Matched Skills */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Matched Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.matchedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Improvement Areas */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                    Improvement Areas
                  </h4>
                  <ul className="space-y-2">
                    {selectedItem.improvementAreas.map((area, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="flex-shrink-0 w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 mr-2"></span>
                        <span className="text-gray-700 dark:text-gray-300">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Highlights */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Suggested Highlights
                  </h4>
                  <ul className="space-y-2">
                    {selectedItem.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2"></span>
                        <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  Select an analysis from the list to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
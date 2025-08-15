import React from 'react';
import { Shield, Eye, Trash2, Lock } from 'lucide-react';

export function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Privacy Policy
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          We take your privacy seriously. Here's how we protect your information.
        </p>
      </div>

      <div className="prose prose-lg max-w-none dark:prose-invert">
        {/* Privacy Principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <Shield className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Data Protection
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              All resume data is processed in-memory and never permanently stored on our servers.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <Eye className="h-10 w-10 text-green-600 dark:text-green-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Tracking
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We don't use invasive tracking technologies or sell your personal information.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <Lock className="h-10 w-10 text-purple-600 dark:text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Secure Processing
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              All data transmission is encrypted and processed using industry-standard security.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <Trash2 className="h-10 w-10 text-red-600 dark:text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Easy Deletion
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You can delete your analysis history at any time with a single click.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Information We Collect
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              ResumeBoost collects only the minimum information necessary to provide our service:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
              <li>Resume text you provide for analysis</li>
              <li>Job descriptions you submit for comparison</li>
              <li>Optional role and preference information</li>
              <li>Basic usage analytics (anonymized)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              How We Use Your Information
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your information is used exclusively to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
              <li>Generate personalized resume analysis and recommendations</li>
              <li>Improve our AI matching algorithms</li>
              <li>Provide customer support when requested</li>
              <li>Maintain and improve our service quality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Data Retention & Deletion
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We believe in minimal data retention:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
              <li>Resume content is processed in real-time and not permanently stored</li>
              <li>Analysis results are stored locally in your browser</li>
              <li>You can delete your analysis history at any time</li>
              <li>Server logs are automatically purged after 30 days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Third-Party Services
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              ResumeBoost may use third-party services for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
              <li>AI processing and natural language analysis</li>
              <li>Basic website analytics (anonymized)</li>
              <li>Performance monitoring and error tracking</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              These services are selected for their strong privacy practices and data protection standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Rights
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
              <li>Access any personal information we have about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Delete your analysis history and data</li>
              <li>Opt out of analytics collection</li>
              <li>Export your analysis data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              If you have questions about this Privacy Policy or how we handle your data, 
              please contact us at{' '}
              <a 
                href="mailto:privacy@resumeboost.com" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                privacy@resumeboost.com
              </a>
            </p>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: January 2024. We may update this Privacy Policy from time to time. 
              We will notify users of any material changes via email or through our service.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
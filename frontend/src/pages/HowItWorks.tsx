import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Search, TrendingUp, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Your Resume',
      description: 'Either upload a text file or paste your resume content directly into our secure platform.',
      details: [
        'Support for multiple input methods',
        'Automatic text parsing and analysis',
        'Privacy-focused processing'
      ]
    },
    {
      icon: Search,
      title: 'Add Job Description',
      description: 'Paste the job posting you\'re targeting, and optionally specify role details for better matching.',
      details: [
        'Intelligent keyword extraction',
        'Skill requirement identification',
        'Role-specific optimization'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Get Insights & Improve',
      description: 'Receive detailed analysis with match scores, skill gaps, and specific suggestions to improve your resume.',
      details: [
        'Comprehensive match scoring',
        'Actionable improvement suggestions',
        'Copyable highlight recommendations'
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          How ResumeBoost Works
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Our AI-powered platform analyzes your resume against specific job requirements 
          and provides actionable insights to improve your chances of getting hired.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-16">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Step Number & Icon */}
              <div className="flex-shrink-0 relative">
                <div className="w-20 h-20 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 border-2 border-blue-600 dark:border-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-500">
                    {index + 1}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {step.description}
                </p>
                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Connecting line (except for last step) */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute left-10 top-20 w-0.5 h-16 bg-gray-300 dark:bg-gray-600"></div>
            )}
          </div>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="mt-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose ResumeBoost?
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Join thousands of job seekers who have improved their hiring success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">3x Higher Callback Rate</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Users report significantly more interview requests after optimizing with ResumeBoost
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">ATS-Friendly Analysis</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Our AI understands what applicant tracking systems look for in resumes
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Privacy First</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your resume data is processed securely and never stored permanently
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to optimize your resume?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Start your analysis now and increase your chances of landing your dream job.
        </p>
        <Link
          to="/tailor"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
        >
          Get Started Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Zap, TrendingUp, FileText, Brain, Award } from 'lucide-react';

export function Landing() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Tailor Your Resume to 
              <span className="text-blue-600 dark:text-blue-400"> Land Your Dream Job</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Get instant AI-powered analysis of how well your resume matches any job description. 
              Receive personalized suggestions and boost your chances of getting hired.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/tailor"
                className="group rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200 flex items-center"
              >
                Start Tailoring
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/how-it-works"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                How it works <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-300 to-indigo-300 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Why ResumeBoost Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Our AI-powered platform helps you optimize your resume for maximum impact
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center group">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <Target className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">Smart Matching</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Advanced AI analyzes job descriptions and identifies the most important keywords and skills to highlight.
              </p>
            </div>

            <div className="text-center group">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                <Brain className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">Instant Insights</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Get detailed feedback on gaps, improvements, and specific suggestions to make your resume stand out.
              </p>
            </div>

            <div className="text-center group">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                <TrendingUp className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">Higher Success Rate</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Users report 3x higher callback rates after optimizing their resumes with ResumeBoost.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 dark:bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Ready to boost your resume?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of job seekers who've improved their hiring chances
            </p>
            <div className="mt-8">
              <Link
                to="/tailor"
                className="inline-flex items-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-blue-600 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
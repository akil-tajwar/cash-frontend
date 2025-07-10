'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Star,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Database,
  BarChart3,
  Settings,
  Smartphone,
  Monitor,
  Laptop,
  CheckCircle,
  ArrowRight,
  Play,
} from 'lucide-react'

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-green-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen relative pt-24 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50"
      >
        <div className="max-w-7xl mx-auto py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div
              className={`space-y-8 ${isVisible ? 'animate-in slide-in-from-left duration-1000' : 'opacity-0'}`}
            >
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full text-sm font-medium text-gray-700 border border-yellow-200">
                <Zap className="w-4 h-4 mr-2 text-yellow-600" />
                #1 Asset Management Platform
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Asset
                </span>
                <br />
                <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
                  Management
                </span>
                <br />
                <span className="text-gray-900">Redefined</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Transform your enterprise with intelligent asset tracking,
                predictive maintenance, and real-time analytics. Experience the
                future of ERP today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-gray-300 hover:border-gray-400 px-8 py-6 text-lg rounded-2xl hover:bg-gray-50 transition-all duration-300 group"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">50M+</div>
                  <div className="text-sm text-gray-600">Assets Tracked</div>
                </div>
              </div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <div
              className={`relative ${isVisible ? 'animate-in slide-in-from-right duration-1000' : 'opacity-0'}`}
            >
              <div className="relative">
                {/* Floating Cards */}
                <div className="absolute -top-8 -left-8 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 animate-bounce z-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Asset Value</div>
                      <div className="text-xl font-bold text-gray-900">
                        $2.4M
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 animate-bounce delay-1000 z-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Efficiency</div>
                      <div className="text-xl font-bold text-gray-900">
                        +127%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Dashboard */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 border border-gray-200">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Asset Overview
                      </h3>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>

                    {/* Chart Placeholder */}
                    <div className="h-40 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl flex items-end justify-around p-4">
                      {[40, 70, 30, 90, 60, 80, 50].map((height, i) => (
                        <div
                          key={i}
                          className="bg-gradient-to-t from-yellow-500 to-orange-400 rounded-t-lg animate-pulse"
                          style={{
                            height: `${height}%`,
                            width: '12%',
                            animationDelay: `${i * 200}ms`,
                          }}
                        ></div>
                      ))}
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-gray-900">
                          1,247
                        </div>
                        <div className="text-sm text-gray-600">
                          Active Assets
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-gray-900">
                          98.2%
                        </div>
                        <div className="text-sm text-gray-600">
                          Availability
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage your enterprise assets efficiently
              and effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Database,
                title: 'Real-time Tracking',
                desc: 'Monitor all your assets in real-time with IoT integration and GPS tracking',
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                desc: 'Get deep insights with AI-powered analytics and predictive maintenance',
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                desc: 'Bank-grade security with end-to-end encryption and compliance',
              },
              {
                icon: Settings,
                title: 'Automated Workflows',
                desc: 'Streamline operations with intelligent automation and custom workflows',
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                desc: 'Enable seamless collaboration across departments and locations',
              },
              {
                icon: TrendingUp,
                title: 'Performance Optimization',
                desc: 'Maximize asset utilization with intelligent recommendations',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-500 hover:transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-gray-900" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apps Section */}
      <section
        id="apps"
        className="py-24 px-4 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Access{' '}
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Anywhere
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage your assets from any device, anywhere in the world
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Smartphone,
                title: 'Mobile App',
                desc: 'iOS & Android apps with offline capabilities',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Monitor,
                title: 'Web Platform',
                desc: 'Full-featured web application accessible from any browser',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: Laptop,
                title: 'Desktop Suite',
                desc: 'Native desktop applications for Windows and macOS',
                color: 'from-green-500 to-emerald-500',
              },
            ].map((app, i) => (
              <div
                key={i}
                className="group text-center transform hover:scale-105 transition-all duration-500"
              >
                <div
                  className={`w-24 h-24 bg-gradient-to-r ${app.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-3xl group-hover:rotate-3 transition-all duration-500`}
                >
                  <app.icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">
                  {app.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{app.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        id="benefits"
        className="py-24 px-4 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-gray-900">
                Why Choose{' '}
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  Asset Tiger?
                </span>
              </h2>

              <div className="space-y-6">
                {[
                  {
                    title: 'Reduce Costs by 40%',
                    desc: 'Optimize asset utilization and prevent unnecessary purchases',
                  },
                  {
                    title: 'Improve Efficiency by 60%',
                    desc: 'Automate workflows and eliminate manual processes',
                  },
                  {
                    title: 'Increase Compliance by 95%',
                    desc: 'Stay compliant with automated reporting and audits',
                  },
                  {
                    title: 'Enhance Visibility by 100%',
                    desc: 'Get complete visibility into your asset lifecycle',
                  },
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start space-x-4 group">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    ROI Calculator
                  </h3>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      $2.4M
                    </div>
                    <div className="text-gray-600">
                      Potential Annual Savings
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 rounded-xl">
                    Calculate Your ROI
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section
        id="reviews"
        className="py-24 px-4 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Trusted by{' '}
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Industry Leaders
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Operations Director',
                company: 'TechCorp Industries',
                content:
                  "Asset Tiger transformed our asset management completely. We've seen a 40% reduction in operational costs and improved efficiency across all departments.",
                rating: 5,
              },
              {
                name: 'Michael Chen',
                role: 'IT Manager',
                company: 'Global Manufacturing Co.',
                content:
                  'The real-time tracking and predictive maintenance features have been game-changers for our operations. Highly recommend Asset Tiger.',
                rating: 5,
              },
              {
                name: 'Emily Rodriguez',
                role: 'Facility Manager',
                company: 'Metro Healthcare',
                content:
                  'Outstanding platform with exceptional support. The ROI was evident within the first quarter of implementation.',
                rating: 5,
              },
            ].map((review, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{review.content}"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {review.name}
                    </div>
                    <div className="text-sm text-gray-600">{review.role}</div>
                    <div className="text-sm text-gray-500">
                      {review.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Ready to Transform Your Asset Management?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of companies already using Asset Tiger to optimize
            their operations and reduce costs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg rounded-2xl shadow-xl font-semibold transform hover:scale-105 transition-all duration-300">
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-2xl font-semibold"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-24 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Get in Touch
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Ready to revolutionize your asset management? Our team is here
                to help you get started.
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                    <span className="text-gray-900 font-bold">📧</span>
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-gray-400">hello@assettiger.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                    <span className="text-gray-900 font-bold">📞</span>
                  </div>
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="text-gray-400">+1 (555) 123-TIGER</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                    <span className="text-gray-900 font-bold">📍</span>
                  </div>
                  <div>
                    <div className="font-semibold">Address</div>
                    <div className="text-gray-400">
                      123 Innovation Drive
                      <br />
                      Tech Valley, CA 94025
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
                    placeholder="Your Company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your asset management needs..."
                  ></textarea>
                </div>
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 py-4 rounded-xl font-semibold text-lg transform hover:scale-105 transition-all duration-300">
                  Send Message
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faqs"
        className="py-24 px-4 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about Asset Tiger
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: 'How quickly can we implement Asset Tiger?',
                answer:
                  'Most organizations are up and running within 2-4 weeks. Our dedicated onboarding team ensures a smooth transition with minimal disruption to your operations.',
              },
              {
                question:
                  'Can Asset Tiger integrate with our existing systems?',
                answer:
                  'Yes! Asset Tiger offers robust APIs and pre-built integrations with popular ERP, CMMS, and accounting systems. Our integration team can help with custom connections.',
              },
              {
                question: 'What kind of support do you provide?',
                answer:
                  'We offer comprehensive support including 24/7 technical assistance, dedicated account managers for Enterprise clients, extensive documentation, and regular training sessions.',
              },
              {
                question: 'Is my data secure with Asset Tiger?',
                answer:
                  'Absolutely. We use enterprise-grade encryption, SOC 2 compliance, and follow industry best practices for data security. Your data is hosted in secure, redundant data centers.',
              },
              {
                question: 'Can I try Asset Tiger before purchasing?',
                answer:
                  'Yes! We offer a 14-day free trial with full access to all features. No credit card required. Our team can also provide a personalized demo tailored to your needs.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-white font-bold text-sm">Q</span>
                  </div>
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed ml-12">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">Still have questions?</p>
            <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-semibold">
              Contact Our Experts
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      
    </div>
  )
}

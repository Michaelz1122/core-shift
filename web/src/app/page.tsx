import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight text-[#059669]">CoreShift</div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
            <Link href="/support" className="hover:text-gray-900 transition-colors">Support</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          Build consistency.<br />
          <span className="text-[#059669]">Achieve your goals.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Get back on track when life gets in the way. CoreShift is your personal growth system designed to help you execute daily actions without the overwhelming planning.
        </p>
        <div className="flex justify-center gap-4">
          <a href="#" className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl">
            Get it on Google Play
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">A System Built for Humans</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We know you're not perfect. That's why CoreShift is designed to help you recover from setbacks quickly.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-[#059669] rounded-xl flex items-center justify-center mb-6 text-xl">🎯</div>
              <h3 className="font-bold text-xl mb-3">Goal Ownership</h3>
              <p className="text-gray-600">Define your own Why. Break it down into daily actions you control. No rigid templates.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 text-xl">🛡️</div>
              <h3 className="font-bold text-xl mb-3">Recovery Engine</h3>
              <p className="text-gray-600">Procrastinating? Use our built-in friction reducers like Focus Sprints and Box Breathing to activate.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 text-xl">🌙</div>
              <h3 className="font-bold text-xl mb-3">Evening Review</h3>
              <p className="text-gray-600">A daily ritual to reflect on your progress, celebrate small wins, and prepare for tomorrow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-12">
            <div className="flex gap-6">
              <div className="w-10 h-10 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Set Your Core Goals</h3>
                <p className="text-gray-600">Add the long-term objectives that matter most to you.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-10 h-10 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Define Daily Actions</h3>
                <p className="text-gray-600">Map specific, actionable steps to your goals. See them all in one unified daily checklist.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-10 h-10 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Review & Adjust</h3>
                <p className="text-gray-600">Take 2 minutes every evening to log progress and maintain momentum.</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-3xl aspect-[4/5] flex items-center justify-center text-gray-400 border-8 border-gray-50 shadow-2xl">
            [App Screenshot Placeholder]
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gray-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to take control?</h2>
          <p className="text-xl text-gray-400 mb-10">Join thousands of users building better habits and consistent execution with CoreShift.</p>
          <a href="#" className="bg-[#059669] text-white px-8 py-4 rounded-full font-bold hover:bg-[#047857] transition-all inline-block">
            Download CoreShift Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-bold text-xl tracking-tight text-[#059669]">CoreShift</div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Use</Link>
            <Link href="/support" className="hover:text-gray-900 transition-colors">Support</Link>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} MZ Apps. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

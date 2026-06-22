import Link from "next/link";
import Image from "next/image";
import { Target, ShieldCheck, Moon, ArrowRight, Play, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-[#059669] selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-extrabold text-2xl tracking-tight text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#059669] to-[#047857] rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
              <span className="text-white text-lg leading-none">C</span>
            </div>
            CoreShift
          </div>
          <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-600">
            <a href="#features" className="hover:text-[#059669] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#059669] transition-colors">How It Works</a>
            <Link href="/support" className="hover:text-[#059669] transition-colors">Support</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#059669]/10 to-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-gray-900 leading-[1.1]">
          Build consistency.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#059669] to-[#10B981]">Achieve your goals.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Get back on track when life gets in the way. CoreShift is your personal growth system designed to help you execute daily actions without the overwhelming planning.
        </p>
        <div className="flex justify-center gap-4">
          <a href="#" className="group bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2">
            <Play size={20} className="fill-white" />
            Get it on Google Play
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white px-6 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">A System Built for Humans</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">We know you're not perfect. That's why CoreShift is designed to help you recover from setbacks quickly.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-[#059669]/30 transition-all hover:shadow-xl hover:shadow-[#059669]/5 group">
              <div className="w-14 h-14 bg-white shadow-sm text-[#059669] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target size={28} />
              </div>
              <h3 className="font-bold text-2xl mb-3">Goal Ownership</h3>
              <p className="text-gray-600 leading-relaxed">Define your own Why. Break it down into daily actions you control. No rigid templates.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/5 group">
              <div className="w-14 h-14 bg-white shadow-sm text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-bold text-2xl mb-3">Recovery Engine</h3>
              <p className="text-gray-600 leading-relaxed">Procrastinating? Use our built-in friction reducers like Focus Sprints and Box Breathing to activate.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/5 group">
              <div className="w-14 h-14 bg-white shadow-sm text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Moon size={28} />
              </div>
              <h3 className="font-bold text-2xl mb-3">Evening Review</h3>
              <p className="text-gray-600 leading-relaxed">A daily ritual to reflect on your progress, celebrate small wins, and prepare for tomorrow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">How It Works</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="flex gap-6 group">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-[#059669] flex items-center justify-center font-bold flex-shrink-0 text-xl group-hover:bg-[#059669] group-hover:text-white transition-colors">1</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Set Your Core Goals</h3>
                <p className="text-gray-500 text-lg">Add the long-term objectives that matter most to you. Maintain complete ownership of your journey.</p>
              </div>
            </div>
            <div className="flex gap-6 group">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-[#059669] flex items-center justify-center font-bold flex-shrink-0 text-xl group-hover:bg-[#059669] group-hover:text-white transition-colors">2</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Define Daily Actions</h3>
                <p className="text-gray-500 text-lg">Map specific, actionable steps to your goals. See them all in one beautifully unified daily dashboard.</p>
              </div>
            </div>
            <div className="flex gap-6 group">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-[#059669] flex items-center justify-center font-bold flex-shrink-0 text-xl group-hover:bg-[#059669] group-hover:text-white transition-colors">3</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Review & Adjust</h3>
                <p className="text-gray-500 text-lg">Take 2 minutes every evening to log progress, earn your streak, and maintain momentum.</p>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#059669]/20 to-blue-500/20 rounded-[40px] blur-2xl group-hover:blur-3xl transition-all opacity-50"></div>
            <div className="relative bg-black rounded-[32px] aspect-[4/5] overflow-hidden border-8 border-gray-900 shadow-2xl">
              <Image 
                src="/mockup.png" 
                alt="CoreShift App Interface" 
                fill 
                className="object-cover"
                quality={100}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#059669]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Ready to take control?</h2>
          <p className="text-xl text-gray-300 mb-12">Join thousands of users building better habits and consistent execution with CoreShift. No ads. Local-first privacy.</p>
          <a href="#" className="bg-white text-gray-900 px-10 py-5 rounded-full font-bold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center gap-3 text-lg">
            Get Started Free
            <ArrowRight size={20} className="text-[#059669]" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-extrabold text-2xl tracking-tight text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-[#059669] to-[#047857] rounded-lg flex items-center justify-center">
              <span className="text-white text-xs leading-none">C</span>
            </div>
            CoreShift
          </div>
          <div className="flex gap-8 text-sm font-semibold text-gray-500">
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
            <Link href="/support" className="hover:text-gray-900 transition-colors">Contact Support</Link>
          </div>
          <div className="text-sm text-gray-400 font-medium">
            © {new Date().getFullYear()} MZ Apps.
          </div>
        </div>
      </footer>
    </div>
  );
}

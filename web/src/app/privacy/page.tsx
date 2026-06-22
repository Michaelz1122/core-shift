import Link from "next/link";
import { ArrowLeft, ShieldCheck, Database, EyeOff } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-[#059669] selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 transition-all duration-300">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-[#059669] transition-colors font-medium">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <div className="font-extrabold tracking-tight text-gray-900">
            CoreShift
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <div className="mb-12 border-b border-gray-100 pb-8">
            <div className="w-16 h-16 bg-green-50 text-[#059669] rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-gray-900">Privacy Policy</h1>
            <p className="text-gray-500 font-medium">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          <div className="prose prose-gray max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#059669]">
            <p className="text-lg text-gray-600 leading-relaxed mb-10">
              At CoreShift, we believe your personal goals and habits are strictly your business. We have built this application with a "Privacy-First, Local-First" architecture. This Privacy Policy explains how we handle your information when you use the CoreShift mobile application.
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100">
              <h2 className="text-xl mt-0 mb-4 flex items-center gap-2 text-gray-900">
                <Database size={24} className="text-[#059669]" />
                1. Data Collection & Storage
              </h2>
              <p className="mb-0 text-gray-600">
                <strong>We do not collect, transmit, or store any of your personal data on external servers.</strong> 
                <br /><br />
                All data you enter into CoreShift (including your goals, daily actions, streaks, and evening reviews) is stored <strong>locally on your device</strong> using your device's secure local storage. Because your data never leaves your device, we have no access to it, and therefore we cannot share it with any third parties.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100">
              <h2 className="text-xl mt-0 mb-4 flex items-center gap-2 text-gray-900">
                <EyeOff size={24} className="text-[#059669]" />
                2. No Account Required
              </h2>
              <p className="mb-0 text-gray-600">
                CoreShift does not require you to create an account, log in, or provide an email address. You can start using the app immediately with complete anonymity.
              </p>
            </div>

            <h2 className="text-2xl mt-12 mb-4 text-gray-900">3. Third-Party Services (Google Play Data Safety)</h2>
            <p className="text-gray-600">
              To provide basic functionality and analytics, CoreShift integrates with the following trusted third-party services:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-8">
              <li><strong>Firebase Analytics:</strong> We collect completely anonymous, aggregated usage data (such as "App Opened" or "Goal Created") to help us understand how the app is used and identify crashes. This data is entirely anonymous and cannot be linked to your identity or the specific content of your goals.</li>
              <li><strong>Google AdMob:</strong> We use AdMob to display optional rewarded ads to support the development of CoreShift. AdMob may use device identifiers to serve personalized ads based on your device settings.</li>
            </ul>

            <h2 className="text-2xl mt-12 mb-4 text-gray-900">4. Device Permissions</h2>
            <p className="text-gray-600">
              CoreShift requests the following permissions to function correctly:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-8">
              <li><strong>Notifications:</strong> Used exclusively to send you local reminders for your Morning Planning and Evening Review. These notifications are scheduled locally on your device.</li>
              <li><strong>Vibration / Haptics:</strong> Used to provide tactile feedback when you complete actions.</li>
            </ul>

            <h2 className="text-2xl mt-12 mb-4 text-gray-900">5. Deleting Your Data</h2>
            <p className="text-gray-600">
              Because all data is stored locally, you have complete control over it. You can delete all your data instantly by:
            </p>
            <ol className="list-decimal pl-6 text-gray-600 space-y-2 mb-8">
              <li>Using the "Factory Reset" option within the app Settings.</li>
              <li>Uninstalling the CoreShift application from your device.</li>
              <li>Clearing the app's data in your device's system settings.</li>
            </ol>

            <h2 className="text-2xl mt-12 mb-4 text-gray-900">6. Changes to This Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last Updated" date at the top of this page. We encourage you to review this Privacy Policy periodically.
            </p>

            <h2 className="text-2xl mt-12 mb-4 text-gray-900">7. Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at:
              <br />
              <a href="mailto:mzapps.support@gmail.com" className="font-semibold mt-2 inline-block">mzapps.support@gmail.com</a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-bold text-xl tracking-tight text-gray-400">CoreShift</div>
          <div className="text-sm text-gray-400 font-medium">
            © {new Date().getFullYear()} MZ Apps. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

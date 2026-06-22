import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24">
      {/* Simple Nav */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="font-bold text-xl tracking-tight text-[#059669]">
            CoreShift
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-12">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p>CoreShift respects your privacy and is designed to operate locally on your device. We do not require an account, and we do not collect, transmit, or store your personal goals, actions, or habits on our servers.</p>
            <p>All user data is stored locally using device storage (`AsyncStorage`). If you uninstall the app or clear the app's data, your history will be permanently deleted unless backed up via native device backup services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Analytics and Crash Reporting</h2>
            <p>We may collect anonymous crash reports and basic usage analytics (such as screen views and button clicks) strictly to improve the app's stability and user experience. This data contains no personally identifiable information and cannot be linked back to your specific goals or identity.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Third-Party Services</h2>
            <p>CoreShift may use third-party services (such as Google Play Services or Apple App Store services) to facilitate in-app reviews and application updates. These services have their own privacy policies regarding any data they collect.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Changes to This Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Contact Us</h2>
            <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at:</p>
            <a href="mailto:mzapps.support@gmail.com" className="text-[#059669] hover:underline font-medium">mzapps.support@gmail.com</a>
          </section>
        </div>
      </main>
    </div>
  );
}

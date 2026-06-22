import Link from "next/link";

export default function TermsOfUse() {
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
        <h1 className="text-4xl font-bold mb-8">Terms of Use</h1>
        <p className="text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p>By downloading or using the CoreShift app, these terms will automatically apply to you – you should make sure therefore that you read them carefully before using the app.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
            <p>You are not allowed to copy, or modify the app, any part of the app, or our trademarks in any way. You are not allowed to attempt to extract the source code of the app, and you also shouldn't try to translate the app into other languages, or make derivative versions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Disclaimer</h2>
            <p>The app is provided "as is". CoreShift makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Limitations</h2>
            <p>In no event shall CoreShift or its suppliers be liable for any damages arising out of the use or inability to use the application.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Contact Us</h2>
            <p>If you have any questions or suggestions about our Terms and Conditions, do not hesitate to contact us at:</p>
            <a href="mailto:mzapps.support@gmail.com" className="text-[#059669] hover:underline font-medium">mzapps.support@gmail.com</a>
          </section>
        </div>
      </main>
    </div>
  );
}

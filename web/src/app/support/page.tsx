import Link from "next/link";

export default function Support() {
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
        <h1 className="text-4xl font-bold mb-8">Support & Contact</h1>
        <p className="text-gray-600 mb-12 text-lg">We're here to help you get the most out of CoreShift. Whether you found a bug or have an idea to improve the app, we want to hear from you.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <a href="mailto:mzapps.support@gmail.com?subject=CoreShift%20Bug%20Report" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-[#059669] transition-colors group block">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6 text-xl">🐛</div>
            <h3 className="font-bold text-xl mb-2 group-hover:text-[#059669] transition-colors">Report a Bug</h3>
            <p className="text-gray-500">Found something broken? Let us know so we can fix it.</p>
          </a>

          <a href="mailto:mzapps.support@gmail.com?subject=CoreShift%20Feature%20Suggestion" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-[#059669] transition-colors group block">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 text-xl">💡</div>
            <h3 className="font-bold text-xl mb-2 group-hover:text-[#059669] transition-colors">Suggest a Feature</h3>
            <p className="text-gray-500">Have an idea to make CoreShift better? We're listening.</p>
          </a>

          <a href="mailto:mzapps.support@gmail.com?subject=CoreShift%20Support%20Request" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-[#059669] transition-colors group block md:col-span-2">
            <div className="w-12 h-12 bg-green-100 text-[#059669] rounded-xl flex items-center justify-center mb-6 text-xl">✉️</div>
            <h3 className="font-bold text-xl mb-2 group-hover:text-[#059669] transition-colors">Contact Support Directly</h3>
            <p className="text-gray-500 mb-4">For any other questions or assistance, reach out to us via email.</p>
            <span className="font-mono text-[#059669] bg-green-50 px-3 py-1 rounded">mzapps.support@gmail.com</span>
          </a>
        </div>
      </main>
    </div>
  );
}

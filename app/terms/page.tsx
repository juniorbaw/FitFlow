export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
          <p className="text-gray-700">
            By accessing and using ClientWin, you accept and agree to be bound by the terms
            and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Use of Service</h2>
          <p className="text-gray-700 mb-4">
            ClientWin provides Instagram automation services. You agree to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Use the service in compliance with Instagram Terms of Service</li>
            <li>Not use the service for spam or abusive purposes</li>
            <li>Be responsible for all activity under your account</li>
            <li>Keep your account credentials secure</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Instagram Connection</h2>
          <p className="text-gray-700">
            When you connect your Instagram account, you authorize ClientWin to access your
            Instagram data as described in our Privacy Policy. You can revoke this access at
            any time through your Instagram settings or our dashboard.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Limitations of Liability</h2>
          <p className="text-gray-700">
            ClientWin is provided "as is" without any warranties. We are not responsible for
            any damages or losses resulting from your use of the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Termination</h2>
          <p className="text-gray-700">
            We reserve the right to terminate or suspend your account at any time for violation
            of these terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
          <p className="text-gray-700">
            We may modify these terms at any time. Continued use of the service after changes
            constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
          <p className="text-gray-700">
            For questions about these Terms of Service, please contact us.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

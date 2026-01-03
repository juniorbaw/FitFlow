export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            When you use ClientWin and connect your Instagram account, we collect:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Your Instagram username and user ID</li>
            <li>Your Instagram posts and media</li>
            <li>Comments on your posts</li>
            <li>Access tokens to interact with Instagram on your behalf</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            We use your Instagram data to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Display your Instagram posts and comments in our dashboard</li>
            <li>Automate direct messages based on comments (when you create campaigns)</li>
            <li>Provide analytics about your Instagram engagement</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Storage</h2>
          <p className="text-gray-700">
            Your data is securely stored in our database. We use industry-standard encryption
            and security practices to protect your information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p className="text-gray-700 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Disconnect your Instagram account at any time</li>
            <li>Request deletion of your data</li>
            <li>Access all data we have collected about you</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700">
            If you have questions about this Privacy Policy, please contact us.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

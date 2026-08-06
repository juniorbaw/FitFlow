export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-4xl font-bold mb-8">Politique de Confidentialité</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Informations que nous collectons</h2>
          <p className="text-gray-700 mb-4">
            Lorsque vous utilisez FitFlow et connectez votre compte Instagram, nous collectons :
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Votre nom d'utilisateur et ID Instagram</li>
            <li>Vos posts et médias Instagram</li>
            <li>Les commentaires sur vos posts</li>
            <li>Les tokens d'accès pour interagir avec Instagram en votre nom</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Comment nous utilisons vos données</h2>
          <p className="text-gray-700 mb-4">
            Nous utilisons vos données Instagram pour :
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Afficher vos posts et commentaires Instagram dans notre dashboard</li>
            <li>Automatiser l'envoi de messages directs basés sur les commentaires</li>
            <li>Fournir des analytics sur votre engagement Instagram</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Stockage des données</h2>
          <p className="text-gray-700">
            Vos données sont stockées de manière sécurisée dans notre base de données. Nous utilisons 
            des pratiques de chiffrement et de sécurité conformes aux standards de l'industrie pour 
            protéger vos informations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Vos droits</h2>
          <p className="text-gray-700 mb-4">
            Vous avez le droit de :
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Déconnecter votre compte Instagram à tout moment</li>
            <li>Demander la suppression de vos données</li>
            <li>Accéder à toutes les données que nous avons collectées sur vous</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Nous contacter</h2>
          <p className="text-gray-700">
            Si vous avez des questions concernant cette politique de confidentialité, contactez-nous à contact@fitflow.app
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

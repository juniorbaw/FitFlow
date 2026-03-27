export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-4xl font-bold mb-8">Conditions Générales d'Utilisation</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Acceptation des conditions</h2>
          <p className="text-gray-700">
            En accédant et en utilisant FitFlow, vous acceptez et vous engagez à respecter les 
            termes et conditions de cet accord.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Utilisation du service</h2>
          <p className="text-gray-700 mb-4">
            FitFlow fournit des services d'automatisation Instagram. Vous acceptez de :
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Utiliser le service conformément aux Conditions d'Utilisation d'Instagram</li>
            <li>Ne pas utiliser le service à des fins de spam ou abusives</li>
            <li>Être responsable de toutes les activités sous votre compte</li>
            <li>Garder vos identifiants de compte sécurisés</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Connexion Instagram</h2>
          <p className="text-gray-700">
            Lorsque vous connectez votre compte Instagram, vous autorisez FitFlow à accéder à vos 
            données Instagram comme décrit dans notre Politique de Confidentialité. Vous pouvez 
            révoquer cet accès à tout moment via vos paramètres Instagram ou notre dashboard.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Limitations de responsabilité</h2>
          <p className="text-gray-700">
            FitFlow est fourni "tel quel" sans aucune garantie. Nous ne sommes pas responsables 
            des dommages ou pertes résultant de votre utilisation du service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Résiliation</h2>
          <p className="text-gray-700">
            Nous nous réservons le droit de résilier ou suspendre votre compte à tout moment 
            en cas de violation de ces conditions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Modifications des conditions</h2>
          <p className="text-gray-700">
            Nous pouvons modifier ces conditions à tout moment. L'utilisation continue du service 
            après les modifications constitue une acceptation des nouvelles conditions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
          <p className="text-gray-700">
            Pour toute question concernant ces Conditions d'Utilisation, contactez-nous à contact@fitflow.app
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-xl">FitFlow</span>
          </div>
          
          <div className="flex items-center gap-4">
<Link href="/login">
  <Button variant="ghost">Connexion</Button>
</Link>
<Link href="/signup">
  <Button>Essai gratuit</Button>
</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Transforme chaque commentaire Instagram en{' '}
          <span className="text-blue-600">rendez-vous booké</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          FitFlow automatise vos DM Instagram pour convertir vos commentaires
          en clients. Gagnez 10h/semaine et 10 RDV/mois supplémentaires.
        </p>
        
        <div className="flex gap-4 justify-center mb-8">
          <Button size="lg" className="text-lg px-8">
            Commencer gratuitement →
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8">
            Voir la démo
          </Button>
        </div>
        
        <p className="text-sm text-gray-500">
          ✓ Essai 14 jours gratuit • ✓ Sans carte bancaire • ✓ Setup en 5 min
        </p>
      </section>

      {/* Stats */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold text-blue-600 mb-2">7.5x</p>
              <p className="text-gray-600">Plus de conversions</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-blue-600 mb-2">10h</p>
              <p className="text-gray-600">Économisées par semaine</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-blue-600 mb-2">97%</p>
              <p className="text-gray-600">Taux de satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          Comment ça marche ?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold mb-2">1. Connectez Instagram</h3>
            <p className="text-gray-600">
              Liez votre compte en 1 clic. 100% sécurisé via l'API Meta.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-xl font-semibold mb-2">2. Créez vos templates</h3>
            <p className="text-gray-600">
              Définissez vos messages. Notre IA les personnalise automatiquement.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">3. Magie opère</h3>
            <p className="text-gray-600">
              FitFlow répond automatiquement et book des RDV via Calendly.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Prêt à transformer vos commentaires en clients ?
        </h2>
        <Button size="lg" className="text-lg px-8">
          Démarrer gratuitement maintenant →
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          © 2025 FitFlow. Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}
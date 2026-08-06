'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'

type ExportType = 'leads' | 'conversations' | 'analytics'

interface ExportButtonProps {
  type?: ExportType
  className?: string
}

export default function ExportButton({ type = 'leads', className = '' }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  async function handleExport() {
    setIsExporting(true)
    
    try {
      // Simuler export (à remplacer par vraie API)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Générer CSV
      let csvContent = ''
      let filename = ''
      
      if (type === 'leads') {
        csvContent = generateLeadsCSV()
        filename = `fitflow-leads-${Date.now()}.csv`
      } else if (type === 'conversations') {
        csvContent = generateConversationsCSV()
        filename = `fitflow-conversations-${Date.now()}.csv`
      } else if (type === 'analytics') {
        csvContent = generateAnalyticsCSV()
        filename = `fitflow-analytics-${Date.now()}.csv`
      }
      
      // Télécharger
      downloadCSV(csvContent, filename)
    } catch (error) {
      console.error('Export error:', error)
      alert('Erreur lors de l\'export')
    } finally {
      setIsExporting(false)
    }
  }

  function generateLeadsCSV() {
    const headers = ['Date', 'Username', 'Nom', 'Score', 'Commentaire', 'Statut']
    const rows = [
      ['2024-02-14', '@fit_marie', 'Marie F.', '9', 'Combien coûte ton programme ?', 'Converti'],
      ['2024-02-14', '@julie.health', 'Julie H.', '8', 'Comment je peux commencer ?', 'En cours'],
      ['2024-02-13', '@alex.sport', 'Alex S.', '3', 'Trop bien 💪', 'Ignoré'],
    ]
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  function generateConversationsCSV() {
    const headers = ['Date', 'Lead', 'Message', 'Type', 'Statut']
    const rows = [
      ['2024-02-14 14:30', '@fit_marie', 'Hey Marie ! Merci pour ton intérêt...', 'Bot', 'Envoyé'],
      ['2024-02-14 14:32', '@fit_marie', 'Perte de poids ! J\'ai 8kg à perdre', 'User', 'Reçu'],
    ]
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  function generateAnalyticsCSV() {
    const headers = ['Métrique', 'Valeur', 'Évolution']
    const rows = [
      ['Leads totaux', '847', '+23%'],
      ['Leads VIP', '124', '+31%'],
      ['Conversions', '67', '+18%'],
      ['Revenue', '16750€', '+42%'],
    ]
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  function downloadCSV(content: string, filename: string) {
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={className}
      style={{
        background: isExporting ? '#666' : '#00D26A',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        cursor: isExporting ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        transition: 'all 0.2s'
      }}
    >
      {isExporting ? (
        <>
          <div style={{
            width: 14,
            height: 14,
            border: '2px solid white',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }} />
          Export en cours...
        </>
      ) : (
        <>
          <Download style={{ width: 16, height: 16 }} />
          Exporter CSV
        </>
      )}
    </button>
  )
}

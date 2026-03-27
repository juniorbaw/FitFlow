/**
 * 🤖 ADVANCED AI LEAD SCORING SYSTEM
 * 
 * Amélioration majeure du système de scoring avec:
 * - Analyse de sentiment (NLP basique)
 * - Scoring contextuel multi-facteurs
 * - Détection d'intention d'achat
 * - Urgence temporelle
 * - Historique du lead
 */

export interface LeadScore {
  score: number; // 0-100
  tier: 'cold' | 'warm' | 'hot' | 'qualified';
  confidence: number; // 0-1
  factors: {
    sentiment: number; // -1 à 1 (négatif à positif)
    intent: number; // 0-100 (intention d'achat)
    urgency: number; // 0-100 (besoin urgent)
    engagement: number; // 0-100 (niveau d'engagement)
    qualification: number; // 0-100 (fit avec persona)
  };
  reasoning: string[]; // Explications du score
  nextAction: string; // Action recommandée
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface LeadContext {
  comment: string;
  previousComments?: string[]; // Historique
  accountAge?: number; // Jours depuis création compte
  followerCount?: number;
  isVerified?: boolean;
  previousInteractions?: number; // Nombre d'interactions passées
  timeOfDay?: number; // 0-23 (heure du commentaire)
}

/**
 * SENTIMENT ANALYSIS - Analyse du ton et des émotions
 */
class SentimentAnalyzer {
  private positiveWords = [
    'super', 'génial', 'parfait', 'excellent', 'merci', 'love', 'adore', 
    'incroyable', 'top', 'motivé', 'intéressé', 'motivant', 'wow', 'impressionnant',
    'amazing', 'great', 'awesome', 'fantastic', 'interested', 'motivated'
  ];

  private negativeWords = [
    'nul', 'mauvais', 'déçu', 'arnaque', 'cher', 'pas intéressé', 'non merci',
    'spam', 'fake', 'bad', 'terrible', 'scam', 'expensive', 'not interested'
  ];

  private neutralWords = [
    'peut-être', 'voir', 'info', 'renseignement', 'curieux', 'question',
    'maybe', 'perhaps', 'info', 'curious', 'wondering'
  ];

  analyze(text: string): number {
    const lowerText = text.toLowerCase();
    let score = 0;

    // Compter les mots positifs/négatifs
    this.positiveWords.forEach(word => {
      if (lowerText.includes(word)) score += 0.2;
    });

    this.negativeWords.forEach(word => {
      if (lowerText.includes(word)) score -= 0.3;
    });

    // Points d'exclamation = enthousiasme
    const exclamationCount = (text.match(/!/g) || []).length;
    score += Math.min(exclamationCount * 0.1, 0.3);

    // Emojis positifs
    const positiveEmojis = ['❤️', '😍', '🔥', '💪', '👍', '✨', '⭐', '🙌'];
    positiveEmojis.forEach(emoji => {
      if (text.includes(emoji)) score += 0.15;
    });

    // Normaliser entre -1 et 1
    return Math.max(-1, Math.min(1, score));
  }
}

/**
 * INTENT DETECTION - Détection de l'intention d'achat
 */
class IntentDetector {
  private highIntentPhrases = [
    'comment je fais', 'je veux', 'j\'ai besoin', 'comment faire',
    'combien ça coûte', 'prix', 'tarif', 'abonnement', 'commencer',
    'how do i', 'i want', 'i need', 'how to', 'price', 'cost', 'subscribe'
  ];

  private mediumIntentPhrases = [
    'intéressé', 'curieux', 'en savoir plus', 'détails', 'info',
    'interested', 'curious', 'learn more', 'details', 'tell me'
  ];

  private lowIntentPhrases = [
    'cool', 'nice', 'sympa', 'bien', 'jolie', 'belle photo',
    'great', 'nice', 'cool pic'
  ];

  detect(text: string): number {
    const lowerText = text.toLowerCase();
    let intentScore = 0;

    // High intent = 80-100
    this.highIntentPhrases.forEach(phrase => {
      if (lowerText.includes(phrase)) intentScore += 30;
    });

    // Medium intent = 40-60
    this.mediumIntentPhrases.forEach(phrase => {
      if (lowerText.includes(phrase)) intentScore += 15;
    });

    // Low intent = 10-30
    this.lowIntentPhrases.forEach(phrase => {
      if (lowerText.includes(phrase)) intentScore += 5;
    });

    // Questions = intent moyen-élevé
    if (lowerText.includes('?')) {
      intentScore += 20;
    }

    return Math.min(100, intentScore);
  }
}

/**
 * URGENCY DETECTOR - Détection de l'urgence
 */
class UrgencyDetector {
  private urgentKeywords = [
    'maintenant', 'aujourd\'hui', 'urgent', 'vite', 'rapidement', 'asap',
    'ce soir', 'demain', 'bientôt', 'immédiatement',
    'now', 'today', 'urgent', 'asap', 'quickly', 'soon', 'immediately'
  ];

  private timeframes = [
    { pattern: /dans (\d+) (jour|jours|semaine)/i, multiplier: 1 },
    { pattern: /in (\d+) (day|days|week)/i, multiplier: 1 }
  ];

  detect(text: string): number {
    const lowerText = text.toLowerCase();
    let urgencyScore = 0;

    // Mots-clés urgents
    this.urgentKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        urgencyScore += 30;
      }
    });

    // Délais mentionnés
    this.timeframes.forEach(({ pattern, multiplier }) => {
      const match = text.match(pattern);
      if (match) {
        const days = parseInt(match[1]);
        // Plus court = plus urgent
        urgencyScore += Math.max(0, 40 - (days * multiplier * 5));
      }
    });

    return Math.min(100, urgencyScore);
  }
}

/**
 * QUALIFICATION CHECKER - Vérification du fit persona
 */
class QualificationChecker {
  private fitnessKeywords = [
    'muscu', 'fitness', 'sport', 'entraînement', 'coach', 'perte de poids',
    'transformation', 'muscle', 'cardio', 'nutrition', 'régime',
    'gym', 'workout', 'training', 'weight loss', 'transformation', 'diet'
  ];

  private budgetIndicators = [
    { phrase: 'pas cher', score: 30 },
    { phrase: 'budget limité', score: 40 },
    { phrase: 'prix', score: 60 },
    { phrase: 'investir', score: 80 },
    { phrase: 'cheap', score: 30 },
    { phrase: 'budget', score: 40 },
    { phrase: 'price', score: 60 },
    { phrase: 'invest', score: 80 }
  ];

  check(text: string, context?: LeadContext): number {
    const lowerText = text.toLowerCase();
    let qualScore = 50; // Base neutre

    // Keywords fitness = bon fit
    this.fitnessKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        qualScore += 10;
      }
    });

    // Budget indicators
    this.budgetIndicators.forEach(({ phrase, score }) => {
      if (lowerText.includes(phrase)) {
        qualScore = Math.max(qualScore, score);
      }
    });

    // Contexte social (si disponible)
    if (context) {
      // Compte vérifié = plus qualifié
      if (context.isVerified) qualScore += 10;

      // Follower count (proxy pour sérieux)
      if (context.followerCount) {
        if (context.followerCount > 10000) qualScore += 15;
        else if (context.followerCount > 1000) qualScore += 10;
        else if (context.followerCount < 100) qualScore -= 5; // Fake account risk
      }

      // Compte récent = moins qualifié (risque spam)
      if (context.accountAge && context.accountAge < 30) {
        qualScore -= 10;
      }

      // Interactions précédentes = plus engagé
      if (context.previousInteractions && context.previousInteractions > 3) {
        qualScore += 15;
      }
    }

    return Math.max(0, Math.min(100, qualScore));
  }
}

/**
 * ENGAGEMENT SCORER - Score d'engagement
 */
class EngagementScorer {
  score(text: string, context?: LeadContext): number {
    let engagementScore = 0;

    // Longueur du commentaire (plus long = plus engagé)
    const wordCount = text.split(/\s+/).length;
    if (wordCount > 20) engagementScore += 30;
    else if (wordCount > 10) engagementScore += 20;
    else if (wordCount > 5) engagementScore += 10;
    else engagementScore += 5;

    // Questions = très engagé
    const questionCount = (text.match(/\?/g) || []).length;
    engagementScore += Math.min(questionCount * 15, 30);

    // Mentions personnelles ("je", "mon", "ma")
    const personalPronouns = ['je ', 'j\'', 'mon ', 'ma ', 'mes ', 'i ', 'my ', 'i\'m'];
    personalPronouns.forEach(pronoun => {
      if (text.toLowerCase().includes(pronoun)) {
        engagementScore += 10;
      }
    });

    // Historique d'interactions
    if (context?.previousInteractions) {
      engagementScore += Math.min(context.previousInteractions * 5, 25);
    }

    return Math.min(100, engagementScore);
  }
}

/**
 * MAIN SCORER - Combine tous les facteurs
 */
export class AdvancedLeadScorer {
  private sentimentAnalyzer = new SentimentAnalyzer();
  private intentDetector = new IntentDetector();
  private urgencyDetector = new UrgencyDetector();
  private qualificationChecker = new QualificationChecker();
  private engagementScorer = new EngagementScorer();

  /**
   * Score un lead avec analyse multi-facteurs
   */
  scoreComment(context: LeadContext): LeadScore {
    const { comment } = context;

    // Calculer chaque facteur
    const sentiment = this.sentimentAnalyzer.analyze(comment);
    const intent = this.intentDetector.detect(comment);
    const urgency = this.urgencyDetector.detect(comment);
    const qualification = this.qualificationChecker.check(comment, context);
    const engagement = this.engagementScorer.score(comment, context);

    // Pondération des facteurs
    const weights = {
      sentiment: 0.15,
      intent: 0.30,      // Le plus important
      urgency: 0.20,
      qualification: 0.20,
      engagement: 0.15
    };

    // Score final (0-100)
    const rawScore = 
      (sentiment + 1) * 50 * weights.sentiment +  // Convertir -1,1 en 0-100
      intent * weights.intent +
      urgency * weights.urgency +
      qualification * weights.qualification +
      engagement * weights.engagement;

    const score = Math.round(rawScore);

    // Déterminer le tier
    let tier: LeadScore['tier'];
    if (score >= 75) tier = 'qualified';
    else if (score >= 55) tier = 'hot';
    else if (score >= 35) tier = 'warm';
    else tier = 'cold';

    // Déterminer la priorité
    let priority: LeadScore['priority'];
    if (score >= 75 && urgency > 50) priority = 'urgent';
    else if (score >= 60) priority = 'high';
    else if (score >= 40) priority = 'medium';
    else priority = 'low';

    // Calculer la confiance
    const confidence = this.calculateConfidence(context);

    // Générer le raisonnement
    const reasoning = this.generateReasoning({
      sentiment,
      intent,
      urgency,
      qualification,
      engagement,
      score
    });

    // Recommander une action
    const nextAction = this.recommendAction(tier, urgency, intent);

    return {
      score,
      tier,
      confidence,
      factors: {
        sentiment,
        intent,
        urgency,
        qualification,
        engagement
      },
      reasoning,
      nextAction,
      priority
    };
  }

  /**
   * Calcule la confiance du score (plus de contexte = plus confiant)
   */
  private calculateConfidence(context: LeadContext): number {
    let confidence = 0.5; // Base

    if (context.previousComments && context.previousComments.length > 0) {
      confidence += 0.2;
    }

    if (context.followerCount !== undefined) {
      confidence += 0.1;
    }

    if (context.previousInteractions !== undefined) {
      confidence += 0.1;
    }

    if (context.comment.length > 50) {
      confidence += 0.1;
    }

    return Math.min(1, confidence);
  }

  /**
   * Génère des explications humaines du score
   */
  private generateReasoning(factors: any): string[] {
    const reasons: string[] = [];

    // Sentiment
    if (factors.sentiment > 0.5) {
      reasons.push('🟢 Sentiment très positif détecté');
    } else if (factors.sentiment < -0.3) {
      reasons.push('🔴 Sentiment négatif - à traiter avec précaution');
    }

    // Intent
    if (factors.intent > 70) {
      reasons.push('🎯 Forte intention d\'achat - prêt à agir');
    } else if (factors.intent > 40) {
      reasons.push('🤔 Intérêt modéré - nécessite nurturing');
    } else if (factors.intent < 20) {
      reasons.push('💬 Commentaire social sans intention commerciale');
    }

    // Urgency
    if (factors.urgency > 50) {
      reasons.push('⏰ Besoin urgent exprimé - réponse rapide requise');
    }

    // Qualification
    if (factors.qualification > 70) {
      reasons.push('✅ Excellent fit avec persona cible');
    } else if (factors.qualification < 40) {
      reasons.push('⚠️ Qualification faible - vérifier le fit');
    }

    // Engagement
    if (factors.engagement > 70) {
      reasons.push('💪 Très engagé - commentaire détaillé et personnel');
    }

    // Score global
    if (factors.score >= 75) {
      reasons.push('🔥 LEAD QUALIFIÉ - Priorité maximale');
    } else if (factors.score >= 55) {
      reasons.push('🌡️ Lead chaud - À contacter rapidement');
    }

    return reasons;
  }

  /**
   * Recommande la meilleure action
   */
  private recommendAction(tier: LeadScore['tier'], urgency: number, intent: number): string {
    if (tier === 'qualified') {
      if (urgency > 50) {
        return 'Envoyer DM immédiatement avec offre personnalisée et lien booking';
      }
      return 'Envoyer DM avec call-to-action fort et témoignages';
    }

    if (tier === 'hot') {
      if (intent > 60) {
        return 'Envoyer DM avec informations détaillées et proposition d\'appel';
      }
      return 'Envoyer DM avec contenu éducatif et soft CTA';
    }

    if (tier === 'warm') {
      return 'Envoyer DM avec ressource gratuite (guide, vidéo) pour nurturer';
    }

    // Cold
    return 'Répondre publiquement pour construire relation, éviter DM immédiat';
  }
}

/**
 * HELPER FUNCTIONS - Exportées pour utilisation facile
 */

/**
 * Score rapide un commentaire (version simplifiée)
 */
export function quickScoreComment(comment: string): LeadScore {
  const scorer = new AdvancedLeadScorer();
  return scorer.scoreComment({ comment });
}

/**
 * Score avec contexte complet (version avancée)
 */
export function scoreWithContext(context: LeadContext): LeadScore {
  const scorer = new AdvancedLeadScorer();
  return scorer.scoreComment(context);
}

/**
 * Batch scoring pour plusieurs leads
 */
export function batchScore(contexts: LeadContext[]): LeadScore[] {
  const scorer = new AdvancedLeadScorer();
  return contexts.map(ctx => scorer.scoreComment(ctx));
}

/**
 * Exporter pour compatibilité avec ancien système
 */
export function scoreComment(comment: string): LeadScore {
  return quickScoreComment(comment);
}

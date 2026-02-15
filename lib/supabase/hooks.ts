import { useEffect, useState } from 'react'
import { supabase } from './client'
import type { Lead, Conversation, Message, Coach, Feedback } from './client'

// Hook pour récupérer le coach connecté
export function useCoach() {
  const [coach, setCoach] = useState<Coach | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchCoach() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setCoach(null)
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('coaches')
          .select('*')
          .eq('auth_user_id', user.id)
          .single()

        if (error) throw error
        setCoach(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchCoach()
  }, [])

  return { coach, loading, error }
}

// Hook pour récupérer les leads
export function useLeads(coachId?: string) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!coachId) {
      setLoading(false)
      return
    }

    async function fetchLeads() {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('coach_id', coachId)
          .order('created_at', { ascending: false })

        if (error) throw error
        setLeads(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('leads_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads',
          filter: `coach_id=eq.${coachId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLeads((prev) => [payload.new as Lead, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setLeads((prev) =>
              prev.map((lead) =>
                lead.id === payload.new.id ? (payload.new as Lead) : lead
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setLeads((prev) => prev.filter((lead) => lead.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [coachId])

  return { leads, loading, error }
}

// Hook pour récupérer les conversations
export function useConversations(coachId?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!coachId) {
      setLoading(false)
      return
    }

    async function fetchConversations() {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*, lead:leads(*)')
          .eq('coach_id', coachId)
          .order('updated_at', { ascending: false })

        if (error) throw error
        setConversations(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()

    // Subscribe to realtime
    const channel = supabase
      .channel('conversations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `coach_id=eq.${coachId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setConversations((prev) => [payload.new as Conversation, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setConversations((prev) =>
              prev.map((conv) =>
                conv.id === payload.new.id ? (payload.new as Conversation) : conv
              )
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [coachId])

  return { conversations, loading, error }
}

// Hook pour récupérer les messages d'une conversation
export function useMessages(conversationId?: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!conversationId) {
      setLoading(false)
      return
    }

    async function fetchMessages() {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })

        if (error) throw error
        setMessages(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // Subscribe to realtime messages
    const channel = supabase
      .channel(`messages_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  return { messages, loading, error }
}

// Hook pour récupérer les feedbacks
export function useFeedbacks(coachId?: string) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!coachId) {
      setLoading(false)
      return
    }

    async function fetchFeedbacks() {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .eq('coach_id', coachId)
          .order('created_at', { ascending: false })

        if (error) throw error
        setFeedbacks(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedbacks()
  }, [coachId])

  return { feedbacks, loading, error }
}

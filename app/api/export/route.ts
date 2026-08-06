/**
 * 📊 EXPORT DATA API
 * 
 * Permet aux utilisateurs d'exporter leurs données (leads, clients, analytics)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { errorResponse, Errors, createLogger } from '@/lib/errors';

const logger = createLogger('export-api');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ExportOptions {
  user_id: string;
  type: 'leads' | 'clients' | 'campaigns' | 'all';
  format: 'json' | 'csv';
  date_from?: string;
  date_to?: string;
}

export async function POST(request: NextRequest) {
  try {
    const options: ExportOptions = await request.json();

    if (!options.user_id || !options.type) {
      throw Errors.badRequest('user_id and type required');
    }

    logger.info('Export requested', { 
      user_id: options.user_id, 
      type: options.type,
      format: options.format 
    });

    let data: any = {};

    // Export leads
    if (options.type === 'leads' || options.type === 'all') {
      let query = supabase
        .from('leads')
        .select('*')
        .eq('user_id', options.user_id);

      if (options.date_from) {
        query = query.gte('created_at', options.date_from);
      }
      if (options.date_to) {
        query = query.lte('created_at', options.date_to);
      }

      const { data: leads, error } = await query;
      if (error) throw Errors.database('Failed to export leads', error);
      data.leads = leads;
    }

    // Export clients
    if (options.type === 'clients' || options.type === 'all') {
      const { data: clients, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', options.user_id);

      if (error) throw Errors.database('Failed to export clients', error);
      data.clients = clients;
    }

    // Export campaigns
    if (options.type === 'campaigns' || options.type === 'all') {
      const { data: campaigns, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', options.user_id);

      if (error) throw Errors.database('Failed to export campaigns', error);
      data.campaigns = campaigns;
    }

    // Format as CSV if requested
    if (options.format === 'csv') {
      const csv = convertToCSV(data[options.type === 'all' ? 'leads' : options.type] || []);
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="fitflow-${options.type}-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // Return JSON
    return NextResponse.json({
      success: true,
      exported_at: new Date().toISOString(),
      data
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

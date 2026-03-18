'use client';

import { useState, useEffect } from 'react';
import supabase from '../../lib/supabase';
import Link from 'next/link';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
    
    setEvents(data || []);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-indigo-900 mb-8">EVENTOS</h1>
        
        {loading ? (
          <div className="text-center">A carregar...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold">{event.title}</h2>
                <p className="text-gray-600 mt-2">{event.description}</p>
                <p className="text-indigo-600 font-bold mt-4">📍 {event.location}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
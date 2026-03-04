import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PenSquare, Share2, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-24 py-12">
      <section className="text-center space-y-8 max-w-3xl mx-auto">
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[1.1]">
          Write your story, <br />
          <span className="text-zinc-400">share with the world.</span>
        </h1>
        <p className="text-xl text-zinc-500 max-w-xl mx-auto leading-relaxed">
          A minimalist platform for writers who care about simplicity and performance.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link to="/register" className="bg-black text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-zinc-800 transition-all hover:scale-105">
            Start Writing
          </Link>
          <Link to="/feed" className="bg-white text-black border border-zinc-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-zinc-50 transition-all flex items-center gap-2">
            Explore Feed
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: PenSquare, title: 'Clean Editor', desc: 'Focus on your words with our distraction-free writing environment.' },
          { icon: Share2, title: 'Public Feed', desc: 'Reach a wider audience through our global community feed.' },
          { icon: ShieldCheck, title: 'Secure & Fast', desc: 'Built with modern tech to ensure your data is safe and accessible.' },
        ].map((feature, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-black/5 space-y-4">
            <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center">
              <feature.icon className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-bold">{feature.title}</h3>
            <p className="text-zinc-500 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

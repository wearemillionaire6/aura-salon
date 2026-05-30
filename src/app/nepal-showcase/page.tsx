'use client';

import { useState, useEffect } from 'react';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';

interface DestinationData {
  src: string;
  background: string;
  title: string;
  subtitle: string;
  promptText: string;
  narrativeTitle: string;
  paragraphs: string[];
}

const culturalDestinations: Record<'nepal' | 'japan', DestinationData> = {
  nepal: {
    src: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1280&auto=format&fit=crop', // Boudhanath Stupa / Monk prayer
    background: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1920&auto=format&fit=crop', // Himalayan peak silhouette
    title: 'NEPAL BUDDHISM',
    subtitle: 'THE SILENT ECHO OF THE STUPA',
    promptText: 'SCROLL DOWN TO AWAKEN NARRATIVE',
    narrativeTitle: 'The Whispering Wind of Boudhanath',
    paragraphs: [
      'In the heart of Kathmandu Valley stands Boudhanath, a colossal geometric mandala holding ancient relics. As morning breaks, the clean white dome contrasts against thousands of streaming monochrome prayer flags. Monks in deep maroon robes begin their clockwise Kora, their gentle mantras layering over the rhythmic spin of bronze prayer wheels.',
      'Buddhism in Nepal isn’t simply stored in temples; it breathes through the high altitude elements. It lives within the gaze of the omnipresent wisdom eyes painted on the stupa spires, watching peacefully over travelers who climb the rugged geographic terrain searching for an interior stillness.'
    ]
  },
  japan: {
    src: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=1280&auto=format&fit=crop', // Kyoto traditional street lantern
    background: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1920&auto=format&fit=crop', // Minimalist zen garden geometry
    title: 'KYOTO TRADITION',
    subtitle: 'CHRONICLES OF THE TEA HOUSE',
    promptText: 'SCROLL DOWN TO UNVEIL THE TEA RITUAL',
    narrativeTitle: 'The Architecture of Inward Simplicity',
    paragraphs: [
      'Beyond the modern skylines of Honshu lies old Kyoto, a grid preserved in cedar panels and stone paths. Within the silent confines of a hidden tea house, a Master moves with calculated precision. Every deliberate tilt of the bamboo ladle reflects Chado—the Way of Tea—grounded in harmony, respect, and tranquil detachment.',
      'This heritage is defined by the ephemeral space between gestures. It teaches the viewer to look past the object and focus on the void, mimicking the architectural philosophies that turn standard structures into spiritual sanctuaries.'
    ]
  }
};

export default function AgencyShowcasePage() {
  const [region, setRegion] = useState<'nepal' | 'japan'>('nepal');
  const activeData = culturalDestinations[region];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [region]);

  const docTitle = `Explore ${region === 'nepal' ? 'Nepal' : 'Japan'} | Visual Storytelling & Cultural Heritage`;
  const docDescription = `Immerse yourself in our visual storytelling showcase detailing the deep-seated spiritual and cultural traditions of ${region === 'nepal' ? 'Nepal\'s Boudhanath Stupa' : 'Kyoto\'s traditional tea ceremonies'}.`;

  return (
    <main className="min-h-screen bg-white text-black antialiased selection:bg-black selection:text-white">
      {/* Hoisted Head Metadata for SEO */}
      <title>{docTitle}</title>
      <meta name="description" content={docDescription} />

      {/* Premium Minimal Navigation Toggle */}
      <nav 
        aria-label="Region selector" 
        className="fixed top-6 right-6 z-50 flex space-x-1 bg-white border border-black p-1"
      >
        <button
          id="region-toggle-nepal"
          onClick={() => setRegion('nepal')}
          className={`px-4 py-1.5 text-xs font-mono uppercase tracking-widest transition-colors ${
            region === 'nepal' ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
          }`}
        >
          Nepal
        </button>
        <button
          id="region-toggle-japan"
          onClick={() => setRegion('japan')}
          className={`px-4 py-1.5 text-xs font-mono uppercase tracking-widest transition-colors ${
            region === 'japan' ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
          }`}
        >
          Japan
        </button>
      </nav>

      {/* Interactive Immersive Hero Section */}
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={activeData.src}
        bgImageSrc={activeData.background}
        title={activeData.title}
        date={activeData.subtitle}
        scrollToExpand={activeData.promptText}
        textBlend={true}
      >
        {/* Stark Clean Editorial Page Content */}
        <div className="max-w-3xl mx-auto py-12">
          <span className="text-xs uppercase tracking-[0.4em] text-neutral-400 block mb-3 font-mono">
            01 // Heritage Narrative
          </span>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight text-black uppercase mb-12 border-b border-neutral-200 pb-6">
            {activeData.narrativeTitle}
          </h1>
          
          <div className="space-y-8 text-neutral-800 text-lg leading-relaxed font-light">
            {activeData.paragraphs.map((para, idx) => (
              <p key={idx} className="first-letter:text-4xl first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:text-black">
                {para}
              </p>
            ))}
          </div>

          <hr className="my-16 border-black" />

          {/* Minimalist PRD-Inspired Form Trigger */}
          <div className="flex flex-col items-center text-center space-y-6 py-8">
            <h3 className="text-sm tracking-[0.3em] font-mono uppercase text-black">
              Ready to write your chapter?
            </h3>
            <button 
              id="cta-curate-itinerary"
              className="bg-black text-white px-10 py-4 text-xs font-mono tracking-[0.2em] uppercase transition-all duration-300 hover:bg-neutral-900 active:scale-95 cursor-pointer"
            >
              CURATE EXPERIENTIAL ITINERARY
            </button>
          </div>
        </div>
      </ScrollExpandMedia>
    </main>
  );
}

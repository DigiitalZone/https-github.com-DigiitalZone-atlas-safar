/// <reference path="../react-env-shim.d.ts" />
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Localized = string | { fr?: string; ar?: string; en?: string };

type Destination = {
  id: string;
  name: Localized;
  image?: string;
  wilaya?: Localized;
  region?: Localized;
  unesco?: boolean;
  description?: Localized;
};

const fallbackImage = 'https://picsum.photos/1200/700?blur=1';

const destinations: Destination[] = [
  {
    id: 'casbah-alger',
    name: { fr: 'Casbah d Alger', ar: 'قصبة الجزائر', en: 'Kasbah of Algiers' },
    image:
      'https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=1400&q=80',
    wilaya: 'Alger',
    region: 'Nord',
    unesco: true,
    description: {
      fr: 'Un labyrinthe vivant de ruelles historiques et de panoramas sur la baie.',
      ar: 'متاهة حية من الأزقة التاريخية وإطلالات على الخليج.',
      en: 'A living maze of historic alleys with breathtaking bay views.',
    },
  },
  {
    id: 'timgad',
    name: { fr: 'Timgad', ar: 'تيمقاد', en: 'Timgad' },
    image:
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1400&q=80',
    wilaya: 'Batna',
    region: 'Aurès',
    unesco: true,
    description: {
      fr: 'Une cite romaine parfaitement tracee au coeur des montagnes de l Aures.',
      ar: 'مدينة رومانية مرسومة بدقة في قلب جبال الأوراس.',
      en: 'A perfectly planned Roman city in the heart of the Aures mountains.',
    },
  },
  {
    id: 'taghit',
    name: { fr: 'Taghit', ar: 'تاغيت', en: 'Taghit' },
    image:
      'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=1400&q=80',
    wilaya: 'Béchar',
    region: 'Sahara',
    unesco: false,
    description: {
      fr: 'Dunes dorees, ksour de terre et nuits etoilees dans le grand Sud.',
      ar: 'كثبان ذهبية وقصور طينية وليالٍ مرصعة بالنجوم في الجنوب الكبير.',
      en: 'Golden dunes, earthen ksour, and starlit nights in the deep south.',
    },
  },
];

const pick = (value?: Localized): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.fr || value.ar || value.en || '';
};

type ConfettiPiece = {
  left: string;
  delay: string;
  duration: string;
  rotate: string;
  hue: number;
};

const buildConfetti = (count: number): ConfettiPiece[] =>
  Array.from({ length: count }, (_, i) => ({
    left: `${(i * 97) % 100}%`,
    delay: `${(i % 8) * 0.07}s`,
    duration: `${1.6 + (i % 7) * 0.18}s`,
    rotate: `${(i * 29) % 360}deg`,
    hue: (i * 33) % 360,
  }));

export default function SurprisePage() {
  const navigate = useNavigate();
  const [destIndex, setDestIndex] = useState(0);
  const [confettiKey, setConfettiKey] = useState(0);

  const dest = destinations[destIndex];
  const destinationName = pick(dest?.name);

  const confetti = useMemo(() => buildConfetti(56), [confettiKey]);

  const tryAnother = () => {
    if (destinations.length < 2) {
      setConfettiKey((k: number) => k + 1);
      return;
    }

    let newIdx = destIndex;
    do {
      newIdx = Math.floor(Math.random() * destinations.length);
    } while (newIdx === destIndex);

    setDestIndex(newIdx);
    setConfettiKey((k: number) => k + 1);
  };

  const goPlanner = () => {
    navigate('/planner', {
      state: {
        destination: dest,
        destinationName,
      },
    });
  };

  return (
    <div className="surprise-page">
      <div className="bg-glow" />

      <div className="confetti-layer" key={confettiKey}>
        {confetti.map((piece: ConfettiPiece, idx: number) => (
          <span
            key={`${confettiKey}-${idx}`}
            className="confetti"
            style={{
              left: piece.left,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
              transform: `rotate(${piece.rotate})`,
              background: `hsl(${piece.hue}, 92%, 62%)`,
            }}
          />
        ))}
      </div>

      <section className="card" aria-live="polite">
        <div className="media-wrap">
          <img
            src={dest?.image || fallbackImage}
            alt={destinationName || 'Destination'}
            onError={(e: { currentTarget: { src: string } }) => {
              const img = e.currentTarget;
              if (img.src !== fallbackImage) {
                img.src = fallbackImage;
              }
            }}
          />
        </div>

        <div className="content">
          <p className="eyebrow">Votre surprise</p>
          <h1>{destinationName || 'Destination mystere'}</h1>
          <p className="description">{pick(dest?.description)}</p>

          <div className="meta-row">
            {!!pick(dest?.wilaya) && <span className="badge">Wilaya: {pick(dest?.wilaya)}</span>}
            {!!pick(dest?.region) && <span className="badge">Region: {pick(dest?.region)}</span>}
            {dest?.unesco && <span className="pill">UNESCO</span>}
          </div>

          <div className="actions">
            <button className="secondary" onClick={tryAnother}>
              Try another
            </button>
            <button className="primary" onClick={goPlanner}>
              Planifier
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .surprise-page {
          min-height: 100vh;
          padding: 2rem 1rem;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(1200px 600px at 10% -20%, rgba(255, 207, 91, 0.25), transparent 60%),
            radial-gradient(1000px 500px at 90% 0%, rgba(74, 222, 128, 0.18), transparent 60%),
            linear-gradient(160deg, #f8f5ef 0%, #fff7e8 55%, #f4fff8 100%);
          display: grid;
          place-items: center;
          font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
        }

        .bg-glow {
          position: absolute;
          inset: -20%;
          background: conic-gradient(from 180deg at 50% 50%, rgba(255, 128, 0, 0.08), rgba(0, 200, 120, 0.08), rgba(255, 128, 0, 0.08));
          filter: blur(60px);
          animation: twinkle 10s ease-in-out infinite;
        }

        .confetti-layer {
          pointer-events: none;
          position: absolute;
          inset: 0;
        }

        .confetti {
          position: absolute;
          top: -8%;
          width: 10px;
          height: 18px;
          border-radius: 3px;
          opacity: 0;
          animation-name: fall, twinkle;
          animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1), ease-in-out;
          animation-iteration-count: 1, infinite;
        }

        .card {
          width: min(920px, 100%);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.75);
          box-shadow: 0 20px 60px rgba(74, 54, 24, 0.14);
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          overflow: hidden;
          position: relative;
          z-index: 2;
          animation: fadeUp 600ms ease, scaleIn 500ms ease;
        }

        .media-wrap {
          min-height: 340px;
        }

        .media-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .content {
          padding: 1.4rem 1.2rem;
          display: grid;
          gap: 0.9rem;
          align-content: center;
        }

        .eyebrow {
          margin: 0;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.72rem;
          color: #8d6c2f;
          font-weight: 700;
        }

        h1 {
          margin: 0;
          line-height: 1.12;
          font-size: clamp(1.5rem, 3.8vw, 2.35rem);
          color: #1f2f1c;
        }

        .description {
          margin: 0;
          color: #3f4a3f;
        }

        .meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .badge {
          padding: 0.4rem 0.7rem;
          border-radius: 999px;
          font-size: 0.82rem;
          color: #2d4430;
          background: linear-gradient(120deg, #e6ffd8, #f7ffe4);
          border: 1px solid #cfeeb8;
        }

        .pill {
          padding: 0.4rem 0.75rem;
          border-radius: 10px;
          font-size: 0.82rem;
          color: #7a4b00;
          background: linear-gradient(120deg, #ffe6ae, #fff1cc);
          border: 1px solid #ffd27a;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
        }

        .actions {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
          margin-top: 0.2rem;
        }

        button {
          border: 0;
          border-radius: 12px;
          font-weight: 700;
          padding: 0.68rem 1rem;
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        button:hover {
          transform: translateY(-2px);
        }

        .primary {
          color: #1f2f1c;
          background: linear-gradient(120deg, #ffd166, #ffe7ac);
          box-shadow: 0 10px 25px rgba(221, 163, 0, 0.3);
        }

        .secondary {
          color: #21462f;
          background: linear-gradient(120deg, #b8f9cb, #e5ffe6);
          box-shadow: 0 10px 25px rgba(48, 170, 94, 0.25);
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(26px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0.75;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.65;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes fall {
          0% {
            top: -10%;
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            top: 110%;
            opacity: 0;
          }
        }

        @media (max-width: 860px) {
          .card {
            grid-template-columns: 1fr;
          }

          .media-wrap {
            min-height: 220px;
          }
        }
      `}</style>
    </div>
  );
}

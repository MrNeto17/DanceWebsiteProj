'use client';

import { ESTILOS_DANCA } from '@/lib/constants';

type Props = {
  selected: string[];
  onChange: (styles: string[]) => void;
  color?: 'indigo' | 'purple';
};

export default function StylesSelector({ selected, onChange, color = 'indigo' }: Props) {
  function toggle(style: string) {
    if (selected.includes(style)) {
      onChange(selected.filter(s => s !== style));
    } else {
      onChange([...selected, style]);
    }
  }

  const activeClass = color === 'purple'
    ? 'bg-purple-600 text-white border-purple-600'
    : 'bg-indigo-600 text-white border-indigo-600';

  const inactiveClass = 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300';

  return (
    <div className="flex flex-wrap gap-2">
      {ESTILOS_DANCA.map((style) => (
        <button
          key={style}
          type="button"
          onClick={() => toggle(style)}
          className={`px-3 py-1.5 rounded-full text-sm font-bold border transition-all ${
            selected.includes(style) ? activeClass : inactiveClass
          }`}
        >
          {style}
        </button>
      ))}
    </div>
  );
}
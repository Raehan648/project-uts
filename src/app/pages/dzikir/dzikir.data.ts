export interface DzikirItem {
  id: number;
  arabic: string;
  latin: string;
  arti: string;
  target: number;
  category: 'pagi' | 'petang' | 'umum';
}

export const DZIKIR_PAGI: DzikirItem[] = [
  {
    id: 1,
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
    latin: 'Ashbahnaa wa ashbahal mulku lillaahi walhamdu lillaah',
    arti: 'Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji bagi Allah.',
    target: 1,
    category: 'pagi',
  },
  {
    id: 2,
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا',
    latin: 'Allahumma bika ashbahnaa, wa bika amsaynaa',
    arti: 'Ya Allah, dengan rahmat-Mu kami memasuki waktu pagi dan petang.',
    target: 1,
    category: 'pagi',
  },
  {
    id: 3,
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    latin: 'Subhanallahi wa bihamdih',
    arti: 'Maha Suci Allah dan segala puji bagi-Nya.',
    target: 100,
    category: 'pagi',
  },
  {
    id: 4,
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    latin: 'Laa ilaaha illallahu wahdahu laa syariika lah',
    arti: 'Tidak ada tuhan selain Allah, Yang Maha Esa, tidak ada sekutu bagi-Nya.',
    target: 10,
    category: 'pagi',
  },
  {
    id: 5,
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ',
    latin: 'Allahumma anta rabbii laa ilaaha illaa anta',
    arti: 'Ya Allah, Engkau adalah Tuhanku, tidak ada tuhan selain Engkau.',
    target: 1,
    category: 'pagi',
  },
];

export const DZIKIR_PETANG: DzikirItem[] = [
  {
    id: 6,
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
    latin: 'Amsaynaa wa amsal mulku lillaah',
    arti: 'Kami telah memasuki waktu petang dan kerajaan hanya milik Allah.',
    target: 1,
    category: 'petang',
  },
  {
    id: 7,
    arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا',
    latin: 'Allahumma bika amsaynaa wa bika ashbahnaa',
    arti: 'Ya Allah, dengan rahmat-Mu kami memasuki waktu petang dan pagi.',
    target: 1,
    category: 'petang',
  },
  {
    id: 8,
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    latin: 'Subhanallahi wa bihamdih',
    arti: 'Maha Suci Allah dan segala puji bagi-Nya.',
    target: 100,
    category: 'petang',
  },
];

export const TASBIH_LIST = [
  { arabic: 'سُبْحَانَ اللَّهِ', latin: 'SubhanAllah', target: 33 },
  { arabic: 'الْحَمْدُ لِلَّهِ', latin: 'Alhamdulillah', target: 33 },
  { arabic: 'اللَّهُ أَكْبَرُ', latin: 'Allahu Akbar', target: 34 },
  { arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', latin: 'Laa ilaaha illallah', target: 99 },
  { arabic: 'أَسْتَغْفِرُ اللَّهَ', latin: 'Astaghfirullah', target: 100 },
];
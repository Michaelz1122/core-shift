import type { Struggle, Goal, Action } from '@/types';

const ACTION_BANK: Record<string, Omit<Action, 'id' | 'completed'>[]> = {
  'procrastination+work': [
    { emoji: '⏱️', title: 'Work for 25 min without phone', titleAr: 'اشتغل ٢٥ دقيقة من غير موبايل' },
    { emoji: '📋', title: 'Write 3 tasks for tomorrow', titleAr: 'اكتب ٣ مهام لبكرة' },
    { emoji: '🚫', title: 'No social media before noon', titleAr: 'ممنوع سوشيال ميديا قبل الضهر' },
  ],
  'procrastination+study': [
    { emoji: '📖', title: 'Study for 25 min focused', titleAr: 'ذاكر ٢٥ دقيقة بتركيز' },
    { emoji: '✍️', title: 'Summarize one chapter', titleAr: 'لخص فصل واحد' },
    { emoji: '🚫', title: 'No phone during study', titleAr: 'ممنوع موبايل وقت المذاكرة' },
  ],
  'procrastination+health': [
    { emoji: '🏃', title: '15 min walk outside', titleAr: 'امشي ١٥ دقيقة برة' },
    { emoji: '💧', title: 'Drink 2L water today', titleAr: 'اشرب ٢ لتر ميه النهارده' },
    { emoji: '😴', title: 'Sleep before midnight', titleAr: 'نام قبل ١٢ بليل' },
  ],
  'procrastination+life_balance': [
    { emoji: '📵', title: '1 hour screen-free', titleAr: 'ساعة من غير شاشات' },
    { emoji: '🧹', title: 'Clean one area of your space', titleAr: 'نضف مكان واحد في بيتك' },
    { emoji: '🌅', title: '10 min morning routine', titleAr: '١٠ دقايق روتين صباحي' },
  ],
  'phone_addiction+work': [
    { emoji: '📵', title: 'Phone off for 2 hours at work', titleAr: 'اقفل الموبايل ساعتين في الشغل' },
    { emoji: '⏰', title: 'Set app time limits', titleAr: 'حط حدود وقت للتطبيقات' },
    { emoji: '📋', title: 'Finish hardest task first', titleAr: 'خلص أصعب مهمة الأول' },
  ],
  'phone_addiction+study': [
    { emoji: '📵', title: 'Phone in another room while studying', titleAr: 'حط الموبايل في أوضة تانية وقت المذاكرة' },
    { emoji: '📖', title: 'Read 20 pages', titleAr: 'اقرأ ٢٠ صفحة' },
    { emoji: '✅', title: 'Complete one assignment', titleAr: 'خلص واجب واحد' },
  ],
  'phone_addiction+health': [
    { emoji: '📵', title: 'No phone 1 hour before bed', titleAr: 'ممنوع موبايل ساعة قبل النوم' },
    { emoji: '🏃', title: '20 min exercise', titleAr: '٢٠ دقيقة تمارين' },
    { emoji: '🍎', title: 'Eat one healthy meal', titleAr: 'كل وجبة صحية واحدة' },
  ],
  'phone_addiction+life_balance': [
    { emoji: '📵', title: 'Delete one distracting app', titleAr: 'امسح تطبيق واحد بيشتتك' },
    { emoji: '👥', title: 'Spend 30 min with family', titleAr: 'اقضي ٣٠ دقيقة مع عيلتك' },
    { emoji: '🌳', title: 'Go outside for 20 min', titleAr: 'انزل برة ٢٠ دقيقة' },
  ],
  'focus+work': [
    { emoji: '🎯', title: 'Deep work for 45 min', titleAr: 'اشتغل بتركيز ٤٥ دقيقة' },
    { emoji: '📝', title: 'Plan your top 3 priorities', titleAr: 'حدد أهم ٣ أولويات' },
    { emoji: '🔕', title: 'Turn off all notifications', titleAr: 'اقفل كل الإشعارات' },
  ],
  'focus+study': [
    { emoji: '🎯', title: 'Study one topic deeply', titleAr: 'ذاكر موضوع واحد بعمق' },
    { emoji: '📝', title: 'Take handwritten notes', titleAr: 'اكتب ملاحظات بإيدك' },
    { emoji: '🔕', title: 'Study in a quiet place', titleAr: 'ذاكر في مكان هادي' },
  ],
  'focus+health': [
    { emoji: '🧘', title: '10 min meditation', titleAr: '١٠ دقايق تأمل' },
    { emoji: '🏋️', title: 'One focused workout', titleAr: 'تمرين واحد بتركيز' },
    { emoji: '💤', title: '7+ hours sleep', titleAr: '+٧ ساعات نوم' },
  ],
  'focus+life_balance': [
    { emoji: '📖', title: 'Read for 20 min', titleAr: 'اقرأ ٢٠ دقيقة' },
    { emoji: '🧘', title: '5 min breathing exercise', titleAr: '٥ دقايق تمرين تنفس' },
    { emoji: '📵', title: 'No screens after 9 PM', titleAr: 'ممنوع شاشات بعد ٩ بليل' },
  ],
  'discipline+work': [
    { emoji: '⏰', title: 'Wake up at fixed time', titleAr: 'صحى في ميعاد ثابت' },
    { emoji: '✅', title: 'Finish what you start', titleAr: 'خلص اللي بدأته' },
    { emoji: '📋', title: 'Follow your schedule', titleAr: 'التزم بجدولك' },
  ],
  'discipline+study': [
    { emoji: '⏰', title: 'Study at the same time daily', titleAr: 'ذاكر في نفس الوقت كل يوم' },
    { emoji: '📖', title: 'Review notes before bed', titleAr: 'راجع ملاحظاتك قبل النوم' },
    { emoji: '🚫', title: 'No excuses day', titleAr: 'يوم من غير أعذار' },
  ],
  'discipline+health': [
    { emoji: '🏃', title: 'Exercise even when tired', titleAr: 'اتمرن حتى لو تعبان' },
    { emoji: '🥗', title: 'No junk food today', titleAr: 'ممنوع أكل غير صحي النهارده' },
    { emoji: '💤', title: 'Sleep and wake on time', titleAr: 'نام وصحى في ميعادك' },
  ],
  'discipline+life_balance': [
    { emoji: '📅', title: 'Plan your whole day', titleAr: 'خطط ليومك كله' },
    { emoji: '🧹', title: 'Make your bed', titleAr: 'رتب سريرك' },
    { emoji: '📵', title: 'Screen time under 3 hours', titleAr: 'وقت الشاشات أقل من ٣ ساعات' },
  ],
  'consistency+work': [
    { emoji: '📋', title: 'Show up and do 1 task', titleAr: 'ابدأ واعمل مهمة واحدة' },
    { emoji: '✅', title: 'End day with review', titleAr: 'خلص يومك بمراجعة' },
    { emoji: '🔄', title: 'Repeat yesterday\'s win', titleAr: 'كرر نجاح امبارح' },
  ],
  'consistency+study': [
    { emoji: '📖', title: 'Study at least 15 min', titleAr: 'ذاكر على الأقل ١٥ دقيقة' },
    { emoji: '✍️', title: 'Write one learning', titleAr: 'اكتب حاجة اتعلمتها' },
    { emoji: '🔄', title: 'Don\'t break the chain', titleAr: 'ماتقطعش السلسلة' },
  ],
  'consistency+health': [
    { emoji: '🏃', title: 'Move your body 15 min', titleAr: 'حرك جسمك ١٥ دقيقة' },
    { emoji: '💧', title: 'Drink water consistently', titleAr: 'اشرب ميه بانتظام' },
    { emoji: '😴', title: 'Same sleep time', titleAr: 'نام في نفس الميعاد' },
  ],
  'consistency+life_balance': [
    { emoji: '🌅', title: 'Morning routine 10 min', titleAr: 'روتين صباحي ١٠ دقايق' },
    { emoji: '📵', title: 'Digital detox 1 hour', titleAr: 'ديتوكس رقمي ساعة' },
    { emoji: '🧘', title: 'End day with gratitude', titleAr: 'خلص يومك بامتنان' },
  ],
};

const FALLBACK: Omit<Action, 'id' | 'completed'>[] = [
  { emoji: '🎯', title: 'Complete one important task', titleAr: 'خلص مهمة مهمة واحدة' },
  { emoji: '📵', title: '1 hour without phone', titleAr: 'ساعة من غير موبايل' },
  { emoji: '🏃', title: '15 min physical activity', titleAr: '١٥ دقيقة نشاط بدني' },
];

export function generatePlan(struggle: Struggle | null, goal: Goal | null): Action[] {
  const key = `${struggle ?? 'procrastination'}+${goal ?? 'work'}`;
  const templates = ACTION_BANK[key] ?? FALLBACK;

  return templates.map((t, i) => ({
    ...t,
    id: `action_${Date.now()}_${i}`,
    completed: false,
  }));
}

// Speech adaptation phrases for Google Cloud Speech-to-Text.
// These bias recognition toward the vocabulary a grade 1-3 Khmer student
// is actually likely to say, which makes child speech (pacing, enunciation)
// far more accurate than open-ended recognition.
//
// Edit this file as more curriculum content is added — no changes to
// asr.js are needed.

module.exports = {
  phrases: [
    // ---- Numbers: Khmer digits and Khmer number words ----
    '០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩',
    'សូន្យ', 'មួយ', 'ពីរ', 'បី', 'បួន', 'ប្រាំ', 'ប្រាំមួយ', 'ប្រាំពីរ', 'ប្រាំបី', 'ប្រាំបួន',
    'ដប់', 'ដប់មួយ', 'ដប់ពីរ', 'ដប់បី', 'ដប់បួន', 'ដប់ប្រាំ',
    // ---- Basic math ----
    'បូក', 'ដក', 'គុណ', 'ចែក', 'ស្មើ', 'ស្មើនឹង', 'ចំលើយ', 'ចម្លើយ', 'លេខ', 'រាប់', 'គិតលេខ',
    'ធំជាង', 'តូចជាង', 'ស្មើ', 'ផ្ទៃ', 'ប្រវែង', 'ទទឹង', 'រង្វាស់', 'ឯកតា', 'បញ្ហា', 'ថ្នាក់',
    // ---- Shapes ----
    'រង្វង់', 'ការ៉េ', 'ត្រីកោណ', 'ផ្កាយ', 'ពេជ្រ', 'បេះដូង', 'រាង', 'ជ្រុង', 'បន្ទាត់',
    // ---- Counting / objects ----
    'ផ្លែប៉ោម', 'បាល់', 'ផ្កា', 'ដើមឈើ', 'សត្វ', 'ត្រី', 'បក្សី', 'គោ', 'មាន់', 'កង់',
    // ---- Science / nature ----
    'ទឹក', 'ពន្លឺ', 'ព្រះអាទិត្យ', 'ព្រះច័ន្ទ', 'ភ្លៀង', 'ខ្យល់', 'ដី', 'រុក្ខជាតិ', 'ផ្លែឈើ',
    'ថាមពល', 'ដើម', 'ឫស', 'ស្លឹក', 'ផ្កា', 'គ្រាប់', 'សត្វល្អិត', 'សត្វកណ្តូប',
    // ---- Common lesson/commands ----
    'មេរៀន', 'សំណួរ', 'គ្រូ', 'ខ្ញុំ', 'ចង់', 'ជួយ', 'មិនយល់', 'យល់', 'សាកល្បង', 'ម្តងទៀត',
    'ធ្វើអត់', 'ពិបាក', 'ងាយស្រួល', 'តើ', 'ណា', 'ប៉ុន្មាន', 'លំហាត់',
    // ---- English fallback words children may mix in (math/science) ----
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'plus', 'minus', 'times', 'equals', 'answer', 'question', 'teacher', 'homework',
    'rectangle', 'area', 'length', 'width', 'perimeter', 'triangle', 'square', 'circle',
    'photosynthesis', 'plant', 'water', 'light', 'sun', 'count', 'number'
  ]
};

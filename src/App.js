import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail } from 'lucide-react';

const screeningQuestions = [
  { id: 1, domain: 'inattention', text: "How often do you make careless mistakes when you have to work on a boring or difficult project?" },
  { id: 2, domain: 'inattention', text: "How often do you have difficulty keeping your attention when you are doing boring or repetitive work?" },
  { id: 3, domain: 'inattention', text: "How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?" },
  { id: 4, domain: 'inattention', text: "How often do you misplace or have difficulty finding things at home or at work?" },
  { id: 5, domain: 'inattention', text: "How often are you distracted by activity or noise around you?" },
  { id: 6, domain: 'hyperactivity', text: "How often do you leave your seat in meetings or other situations in which you are expected to remain seated?" },
  { id: 7, domain: 'hyperactivity', text: "How often do you feel restless or fidgety?" },
  { id: 8, domain: 'hyperactivity', text: "How often do you have difficulty unwinding and relaxing when you have time to yourself?" },
  { id: 9, domain: 'hyperactivity', text: "How often do you find yourself talking too much when you are in social situations?" },
  { id: 10, domain: 'hyperactivity', text: "How often do you interrupt others when they are busy?" }
];

const options = [
  { label: "Never", value: 0 },
  { label: "Rarely", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Often", value: 3 },
  { label: "Very Often", value: 4 }
];

export default function App() {
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState({ name: '', age: '', occupation: '' });
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');

  const handleAnswerSelect = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setError('');
  };

  const handleNext = () => {
    if (step === 1) {
      if (!userInfo.name || !userInfo.age) return setError('Name and age are required.');
      setError('');
      setStep(2);
    } else if (step === 2) {
      if (Object.keys(answers).length < screeningQuestions.length) {
        return setError('Please complete all questions to generate an accurate report.');
      }
      setError('');
      setStep(3);
    }
  };

  const generateReport = () => {
    let inattentionScore = 0;
    let hyperactivityScore = 0;

    screeningQuestions.forEach(q => {
      const score = answers[q.id];
      if (score >= 2) { 
        if (q.domain === 'inattention') inattentionScore++;
        if (q.domain === 'hyperactivity') hyperactivityScore++;
      }
    });

    const totalFlags = inattentionScore + hyperactivityScore;
    let primaryDomain = "Combined Type Indicators";
    if (inattentionScore > hyperactivityScore + 2) primaryDomain = "Predominantly Inattentive Indicators";
    if (hyperactivityScore > inattentionScore + 2) primaryDomain = "Predominantly Hyperactive/Impulsive Indicators";

    return { inattentionScore, hyperactivityScore, totalFlags, primaryDomain };
  };

  const handleEmailReport = () => {
    const report = generateReport();
    const subject = encodeURIComponent(`ADHD Screening Report: ${userInfo.name}`);
    const body = encodeURIComponent(`
Confidential Screening Report
-----------------------------------
Name: ${userInfo.name}
Age: ${userInfo.age}
Occupation: ${userInfo.occupation || 'Not provided'}

Assessment Results:
- Total Clinical Flags: ${report.totalFlags} / 10
- Inattention Score: ${report.inattentionScore} / 5
- Hyperactivity Score: ${report.hyperactivityScore} / 5

Primary Trait Pattern: ${report.primaryDomain}

*Note: This is a preliminary screening tool, not a diagnostic confirmation.
    `);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <motion.div 
        className="max-w-3xl w-full bg-white rounded-2xl shadow-floating overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center">
          <h1 className="text-3xl font-bold tracking-tight">Clinical ADHD Screener</h1>
          <p className="opacity-80 mt-2 text-sm">Modern Assessment Portal</p>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: PATIENT INFO */}
            {step === 1 && (
              <motion.div key="step1" variants={pageVariants} initial="initial" animate="in" exit="out" className="space-y-6">
                <h2 className="text-2xl font-semibold mb-6">Patient Demographics</h2>
                {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-md border border-red-100">{error}</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input type="text" value={userInfo.name} onChange={e => setUserInfo({...userInfo, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" placeholder="Enter name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                    <input type="number" value={userInfo.age} onChange={e => setUserInfo({...userInfo, age: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" placeholder="Enter age" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Occupation (Optional)</label>
                    <input type="text" value={userInfo.occupation} onChange={e => setUserInfo({...userInfo, occupation: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" placeholder="e.g., Software Engineer, Student" />
                  </div>
                </div>
                
                <button onClick={handleNext} className="w-full mt-8 bg-indigo-600 text-white font-semibold py-4 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95">
                  Begin Assessment
                </button>
              </motion.div>
            )}

            {/* STEP 2: QUESTIONS */}
            {step === 2 && (
              <motion.div key="step2" variants={pageVariants} initial="initial" animate="in" exit="out" className="space-y-8">
                {error && <p className="text-red-500 text-sm font-medium mb-4 sticky top-0 bg-white py-2 z-10">{error}</p>}
                
                <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-8 custom-scrollbar">
                  {screeningQuestions.map((q, index) => (
                    <div key={q.id} className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors">
                      <p className="text-lg font-medium text-slate-800 mb-4"><span className="text-indigo-500 font-bold mr-2">{index + 1}.</span>{q.text}</p>
                      <div className="flex flex-wrap gap-3">
                        {options.map((opt) => (
                          <button
                            key={opt.label}
                            onClick={() => handleAnswerSelect(q.id, opt.value)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                              answers[q.id] === opt.value 
                                ? 'bg-indigo-600 text-white shadow-md transform scale-105 border-transparent' 
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-6 pt-6 border-t border-slate-100">
                  <button onClick={() => setStep(1)} className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Back</button>
                  <button onClick={handleNext} className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all active:scale-95">Generate Report</button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: DETAILED REPORT */}
            {step === 3 && (
              <motion.div key="step3" variants={pageVariants} initial="initial" animate="in" exit="out" className="space-y-6">
                <h2 className="text-2xl font-bold mb-4 text-slate-800">Assessment Report</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-1">Inattention</p>
                    <p className="text-4xl font-black text-blue-800">{generateReport().inattentionScore} <span className="text-xl text-blue-400 font-medium">/ 5</span></p>
                  </div>
                  <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
                    <p className="text-sm text-purple-600 font-bold uppercase tracking-wider mb-1">Hyperactivity</p>
                    <p className="text-4xl font-black text-purple-800">{generateReport().hyperactivityScore} <span className="text-xl text-purple-400 font-medium">/ 5</span></p>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="text-lg font-semibold mb-2">Clinical Profile: <span className="text-indigo-600">{generateReport().primaryDomain}</span></h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Based on the responses, the patient exhibits <strong>{generateReport().totalFlags}</strong> significant behavioral flags across the two primary ADHD domains. 
                    Scores of 3 or higher in a specific domain warrant a targeted clinical interview focusing on functional impairment in those specific areas of daily life.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button onClick={handleEmailReport} className="flex-1 bg-slate-900 text-white font-semibold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5" />
                    Email Report to Me
                  </button>
                  <button onClick={() => { setStep(1); setAnswers({}); setUserInfo({ name: '', age: '', occupation: '' }); }} className="flex-1 bg-white border-2 border-slate-200 text-slate-700 font-semibold py-4 rounded-xl hover:bg-slate-50 transition-all active:scale-95">
                    Start New Patient
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
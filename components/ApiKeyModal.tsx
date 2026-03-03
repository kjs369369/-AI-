import React, { useState, useEffect } from 'react';

export type ApiTier = 'free' | 'paid';

interface ApiKeyModalProps {
  onSave: (apiKey: string, tier: ApiTier) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [tier, setTier] = useState<ApiTier>('free');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    const savedTier = localStorage.getItem('gemini_api_tier') as ApiTier | null;
    if (savedKey) setApiKey(savedKey);
    if (savedTier) setTier(savedTier);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    localStorage.setItem('gemini_api_key', apiKey.trim());
    localStorage.setItem('gemini_api_tier', tier);
    onSave(apiKey.trim(), tier);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-apple-card-dark rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-8 pb-4 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-apple-blue/10 dark:bg-apple-blue-dark/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-apple-blue dark:text-apple-blue-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-apple-text dark:text-apple-text-dark">
            API 키 설정
          </h2>
          <p className="text-sm text-apple-gray dark:text-apple-gray-dark mt-2">
            Google Gemini API 키가 필요합니다
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          {/* API Key Input */}
          <div>
            <label className="block text-sm font-medium text-apple-text dark:text-apple-text-dark mb-2">
              API 키
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-apple-bg dark:bg-apple-bg-dark text-apple-text dark:text-apple-text-dark placeholder:text-apple-gray/50 focus:outline-none focus:ring-2 focus:ring-apple-blue dark:focus:ring-apple-blue-dark pr-12"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-gray hover:text-apple-text dark:hover:text-apple-text-dark transition"
                aria-label={showKey ? '키 숨기기' : '키 보기'}
              >
                {showKey ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Get API Key Button */}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-sm font-medium text-apple-text dark:text-apple-text-dark hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Google AI Studio에서 API 키 발급받기
          </a>

          {/* Tier Selection */}
          <div>
            <label className="block text-sm font-medium text-apple-text dark:text-apple-text-dark mb-2">
              API 플랜 선택
            </label>
            <div className="space-y-2">
              {/* Free Tier */}
              <button
                type="button"
                onClick={() => setTier('free')}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  tier === 'free'
                    ? 'border-apple-blue dark:border-apple-blue-dark bg-apple-blue/5 dark:bg-apple-blue-dark/5'
                    : 'border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-apple-text dark:text-apple-text-dark">무료 플랜</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium">FREE</span>
                    </div>
                    <p className="text-xs text-apple-gray dark:text-apple-gray-dark mt-1">
                      gemini-2.0-flash 모델 사용 (이미지 품질 보통)
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    tier === 'free' ? 'border-apple-blue dark:border-apple-blue-dark' : 'border-black/20 dark:border-white/20'
                  }`}>
                    {tier === 'free' && <div className="w-3 h-3 rounded-full bg-apple-blue dark:bg-apple-blue-dark" />}
                  </div>
                </div>
              </button>

              {/* Paid Tier */}
              <button
                type="button"
                onClick={() => setTier('paid')}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  tier === 'paid'
                    ? 'border-apple-blue dark:border-apple-blue-dark bg-apple-blue/5 dark:bg-apple-blue-dark/5'
                    : 'border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-apple-text dark:text-apple-text-dark">유료 플랜</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-medium">PRO</span>
                    </div>
                    <p className="text-xs text-apple-gray dark:text-apple-gray-dark mt-1">
                      gemini-2.5-flash 모델 사용 (고품질 이미지, ~$0.04/장)
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    tier === 'paid' ? 'border-apple-blue dark:border-apple-blue-dark' : 'border-black/20 dark:border-white/20'
                  }`}>
                    {tier === 'paid' && <div className="w-3 h-3 rounded-full bg-apple-blue dark:bg-apple-blue-dark" />}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 p-3">
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              API 키는 브라우저에만 저장되며 외부로 전송되지 않습니다.
              Google AI Studio에서 무료로 API 키를 발급받을 수 있습니다.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!apiKey.trim()}
            className="w-full py-3 rounded-xl font-semibold text-white bg-apple-blue dark:bg-apple-blue-dark transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            시작하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyModal;

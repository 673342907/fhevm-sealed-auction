'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContractAddressSelectorProps {
  value: string;
  onChange: (address: string) => void;
  onSet: () => void;
}

export default function ContractAddressSelector({
  value,
  onChange,
  onSet,
}: ContractAddressSelectorProps) {
  const { t } = useLanguage();

  // 预设的测试合约地址
  const PRESET_ADDRESSES = [
    {
      name: `🗳️ ${t.contract.deployed.split(' ')[0]} (Sepolia - Deployed)`,
      address: '0x532d2B3325BA52e7F9FE7De61830A2F120d1082b',
      description: t.contract.deployed,
      recommended: true,
      type: 'voting',
    },
    {
      name: `💻 ${t.contract.local.split(' ')[0]}`,
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      description: t.contract.local,
    },
  ];
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAddress, setCustomAddress] = useState('');

  const handleSelectPreset = (address: string) => {
    onChange(address);
    onSet(); // 自动设置
  };

  const handleSetCustom = () => {
    if (customAddress.trim() && isValidAddress(customAddress.trim())) {
      onChange(customAddress.trim());
      onSet(); // 自动设置
      setCustomAddress('');
      setShowCustomInput(false);
    }
  };

  const isValidAddress = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            ⚙️ {t.contract.title}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {t.contract.desc}
          </p>
        </div>
        {value && isValidAddress(value) && value !== '0x0000000000000000000000000000000000000000' && (
          <span className="px-3 py-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full">
            ✅ {t.contract.set}
          </span>
        )}
      </div>
      
      {/* 已设置状态 */}
      {value && isValidAddress(value) && (
        <div className={`mb-6 p-6 rounded-xl border-2 shadow-lg ${
          value === '0x0000000000000000000000000000000000000000'
            ? 'bg-gradient-to-r from-amber-100 via-orange-50 to-yellow-100 dark:from-amber-900/40 dark:via-orange-900/40 dark:to-yellow-900/40 border-amber-300 dark:border-amber-700'
            : 'bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 border-emerald-300 dark:border-emerald-700'
        }`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">
                  {value === '0x0000000000000000000000000000000000000000' ? '⚠️' : '✅'}
                </span>
                <div>
                  <p className={`text-lg font-bold ${
                    value === '0x0000000000000000000000000000000000000000'
                      ? 'text-amber-800 dark:text-amber-200'
                      : 'text-emerald-800 dark:text-emerald-200'
                  }`}>
                    {value === '0x0000000000000000000000000000000000000000' 
                      ? t.contract.demoMode
                      : t.contract.addressSet}
                  </p>
                  {value === '0x0000000000000000000000000000000000000000' && (
                    <p className="text-sm text-amber-700 dark:text-amber-300 font-medium mt-1">
                      {t.contract.clickToSwitch}
                    </p>
                  )}
                </div>
              </div>
              <p className="font-mono text-sm text-slate-800 dark:text-slate-200 bg-white/60 dark:bg-slate-800/60 px-4 py-3 rounded-lg break-all mb-3 border border-slate-300 dark:border-slate-600">
                {value}
              </p>
              {value === '0x0000000000000000000000000000000000000000' && (
                <div className="bg-white/70 dark:bg-slate-800/70 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">💡</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-2">
                        {t.contract.wantRealData}
                      </p>
                      <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed mb-3">
                        {t.contract.usingDemo}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-100/20 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-300">
                        <span className="text-lg">👉</span>
                        <span>{t.contract.clickChange}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 md:ml-4">
              <button
                onClick={() => onChange('')}
                className={`px-6 py-3 rounded-xl text-base font-bold transition-all shadow-lg hover:scale-105 transform whitespace-nowrap ${
                  value === '0x0000000000000000000000000000000000000000'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 border-2 border-blue-400 dark:border-blue-600'
                    : 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700 border-2 border-blue-300 dark:border-blue-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔄</span>
                  <span>{t.contract.change}</span>
                </div>
              </button>
              {value === '0x0000000000000000000000000000000000000000' && (
                <div className="text-center">
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold mb-1">
                    {t.contract.clickAbove}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-xs text-amber-700 dark:text-amber-300">
                    <span>{t.contract.thenSelect}</span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-200/50 text-blue-700 dark:text-blue-800 rounded font-bold border border-blue-300 dark:border-blue-500">{t.contract.sepoliaTestnet}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 未设置时显示选择界面 */}
      {(!value || !isValidAddress(value)) && (
        <>
          {/* 预设地址 - 大按钮，更明显 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🚀</span>
              <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                {t.contract.preset}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {PRESET_ADDRESSES.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectPreset(preset.address)}
                  className={`w-full text-left p-5 border-2 rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-lg ${
                    preset.recommended
                      ? 'border-blue-400 dark:border-blue-600 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 hover:from-blue-200 hover:to-indigo-200 dark:hover:from-blue-800/50 dark:hover:to-indigo-800/50 shadow-md'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className={`font-bold text-base mb-2 ${
                        preset.recommended ? 'text-blue-800 dark:text-blue-200' : 'text-slate-900 dark:text-slate-100'
                      }`}>
                        {preset.name}
                      </p>
                      <p className={`text-sm ${
                        preset.recommended ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {preset.description}
                      </p>
                    </div>
                    {preset.recommended && (
                      <span className="ml-4 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg font-bold shadow-md">
                        ⭐ {t.contract.recommended || 'Recommended'}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 自定义地址 - 简化 */}
          <div className="border-t-2 border-slate-300 dark:border-slate-700 pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">✏️</span>
                <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                  {t.contract.custom}
                </p>
              </div>
              {!showCustomInput && (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:scale-105"
                >
                  📝 {t.contract.input}
                </button>
              )}
            </div>

            {showCustomInput && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="0x..."
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSetCustom()}
                    className="flex-1 px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg dark:bg-slate-800 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    autoFocus
                  />
                  <button
                    onClick={handleSetCustom}
                    disabled={!isValidAddress(customAddress)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {t.common.confirm}
                  </button>
                  <button
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomAddress('');
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    {t.common.cancel}
                  </button>
                </div>
                {customAddress && !isValidAddress(customAddress) && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    ⚠️ {t.contract.formatError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 简化提示 */}
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 rounded-xl border-2 border-blue-300 dark:border-blue-700 shadow-lg">
            <div className="flex items-start gap-4">
              <span className="text-3xl">💡</span>
              <div className="flex-1">
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
                  🎯 {t.contract.quickStart}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3 font-medium">
                  {t.contract.quickStartDesc}
                </p>
                <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-3 space-y-2 border border-slate-300 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 font-semibold">
                    <span className="text-lg">✅</span>
                    <span>{t.contract.noDeploy}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 font-semibold">
                    <span className="text-lg">✅</span>
                    <span>{t.contract.autoLoad}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 font-semibold">
                    <span className="text-lg">✅</span>
                    <span>{t.contract.allFeatures}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


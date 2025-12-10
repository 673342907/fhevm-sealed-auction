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
          <span className="px-3 py-1 text-xs bg-zama-500/20 dark:bg-zama-500/30 text-zama-700 dark:text-zama-300 rounded-full">
            ✅ {t.contract.set}
          </span>
        )}
      </div>
      
      {/* 已设置状态 */}
      {value && isValidAddress(value) && (
        <div className={`mb-6 p-6 rounded-xl border-2 shadow-lg ${
          value === '0x0000000000000000000000000000000000000000'
            ? 'bg-gradient-to-r from-zama-500/20 via-zama-400/15 to-zama-500/20 dark:from-zama-900/50 dark:via-zama-800/40 dark:to-zama-900/50 border-zama-500/40 dark:border-zama-500/60'
            : 'bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 border-zinc-300 dark:border-zinc-600'
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
                      ? 'text-zama-600 dark:text-zama-400'
                      : 'text-zama-600 dark:text-zama-400'
                  }`}>
                    {value === '0x0000000000000000000000000000000000000000' 
                      ? t.contract.demoMode
                      : t.contract.addressSet}
                  </p>
                  {value === '0x0000000000000000000000000000000000000000' && (
                    <p className="text-sm text-zama-600 dark:text-zama-400 font-medium mt-1">
                      {t.contract.clickToSwitch}
                    </p>
                  )}
                </div>
              </div>
              <p className="font-mono text-sm text-slate-800 dark:text-slate-200 bg-white/60 dark:bg-slate-800/60 px-4 py-3 rounded-lg break-all mb-3 border border-slate-300 dark:border-slate-600">
                {value}
              </p>
              {value === '0x0000000000000000000000000000000000000000' && (
                <div className="bg-white/70 dark:bg-slate-800/70 rounded-lg p-4 border border-zama-500/40 dark:border-zama-500/50">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">💡</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-zama-600 dark:text-zama-400 mb-2">
                        {t.contract.wantRealData}
                      </p>
                      <p className="text-xs text-zama-600 dark:text-zama-400 leading-relaxed mb-3">
                        {t.contract.usingDemo}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-zama-600 dark:text-zama-400 bg-zama-500/20 dark:bg-zama-500/30 px-3 py-2 rounded-lg border border-zama-500/40 dark:border-zama-500/50">
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
                    ? 'bg-gradient-to-r from-zama-500 to-zama-600 text-black hover:from-zama-400 hover:to-zama-500 border-2 border-zama-400 dark:border-zama-500 shadow-zama-lg'
                    : 'bg-white dark:bg-zinc-800 text-zama-600 dark:text-zama-400 hover:bg-zama-50 dark:hover:bg-zinc-700 border-2 border-zama-300 dark:border-zama-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔄</span>
                  <span>{t.contract.change}</span>
                </div>
              </button>
              {value === '0x0000000000000000000000000000000000000000' && (
                <div className="text-center">
                  <p className="text-xs text-zama-600 dark:text-zama-400 font-semibold mb-1">
                    {t.contract.clickAbove}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-xs text-zama-600 dark:text-zama-400">
                    <span>{t.contract.thenSelect}</span>
                    <span className="px-2 py-1 bg-zama-500/20 dark:bg-zama-500/30 text-zama-700 dark:text-zama-300 rounded font-bold border border-zama-500/40 dark:border-zama-500/50">{t.contract.sepoliaTestnet}</span>
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
          {/* 快速体验按钮 - 最显眼 */}
          <div className="mb-6">
            <div className="relative">
              <button
                onClick={() => {
                  const quickAddress = PRESET_ADDRESSES.find(p => p.recommended)?.address || PRESET_ADDRESSES[0].address;
                  handleSelectPreset(quickAddress);
                }}
                className="w-full relative px-8 py-6 bg-gradient-to-r from-zama-500 via-zama-400 to-zama-500 text-black rounded-xl font-bold text-lg hover:from-zama-400 hover:via-zama-300 hover:to-zama-400 transition-all shadow-2xl shadow-zama-500/50 hover:shadow-zama-500/70 transform hover:scale-[1.02] overflow-hidden group"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                {/* Content */}
                <div className="relative z-10 flex items-center justify-center gap-4">
                  <span className="text-3xl animate-pulse">🚀</span>
                  <div className="text-left">
                    <div className="text-xl font-bold mb-1">{t.contract.quickExperience || '快速体验'}</div>
                    <div className="text-sm opacity-90">{t.contract.quickExperienceDesc || '一键使用已部署的合约，立即开始体验投票功能'}</div>
                  </div>
                  <span className="text-2xl">▶️</span>
                </div>
              </button>
            </div>
          </div>

          {/* 预设地址 - 其他选项 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⚙️</span>
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
                      ? 'border-zama-500 dark:border-zama-500 bg-gradient-to-r from-zama-500/20 via-zama-400/15 to-zama-500/20 dark:from-zama-900/50 dark:via-zama-800/40 dark:to-zama-900/50 hover:from-zama-500/30 hover:via-zama-400/25 hover:to-zama-500/30 dark:hover:from-zama-800/60 dark:hover:via-zama-700/50 dark:hover:to-zama-800/60 shadow-zama-lg'
                      : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className={`font-bold text-base mb-2 ${
                        preset.recommended ? 'text-zama-600 dark:text-zama-400' : 'text-zinc-900 dark:text-zinc-100'
                      }`}>
                        {preset.name}
                      </p>
                      <p className={`text-sm ${
                        preset.recommended ? 'text-zama-700 dark:text-zama-300' : 'text-zinc-600 dark:text-zinc-400'
                      }`}>
                        {preset.description}
                      </p>
                    </div>
                    {preset.recommended && (
                      <span className="ml-4 px-4 py-2 text-sm bg-zama-500 text-black rounded-lg font-bold shadow-zama">
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
                  className="px-4 py-2 bg-gradient-to-r from-zama-500 to-zama-600 text-black rounded-lg text-sm font-bold hover:from-zama-400 hover:to-zama-500 transition-all shadow-zama hover:scale-105"
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
                    className="flex-1 px-4 py-2 border border-zama-300 dark:border-zama-600 rounded-lg dark:bg-zinc-800 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zama-500 focus:border-zama-500"
                    autoFocus
                  />
                  <button
                    onClick={handleSetCustom}
                    disabled={!isValidAddress(customAddress)}
                    className="px-4 py-2 bg-zama-500 text-black rounded-lg hover:bg-zama-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold shadow-zama"
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
          <div className="mt-6 p-6 bg-gradient-to-r from-zama-500/10 via-zama-400/8 to-zama-500/10 dark:from-zama-900/40 dark:via-zama-800/30 dark:to-zama-900/40 rounded-xl border-2 border-zama-500/30 dark:border-zama-500/50 shadow-zama-lg">
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


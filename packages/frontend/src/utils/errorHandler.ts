/**
 * 全局错误处理器
 * 过滤掉非关键错误（如 Talisman 扩展未配置）
 */

/**
 * 检查是否是 Talisman 相关的错误
 */
export function isTalismanError(error: any): boolean {
  if (!error) return false;
  
  const errorMessage = error.message || error.toString() || '';
  const errorName = error.name || '';
  
  return (
    errorMessage.includes('Talisman') ||
    errorMessage.includes('talisman') ||
    errorMessage.includes('onboarding') ||
    errorName.includes('Talisman')
  );
}

/**
 * 全局错误处理器
 * 在应用启动时调用，过滤 Talisman 错误
 */
export function setupGlobalErrorHandler() {
  if (typeof window === 'undefined') return;

  // 捕获未处理的 Promise 拒绝
  window.addEventListener('unhandledrejection', (event) => {
    if (isTalismanError(event.reason)) {
      console.warn('已忽略 Talisman 扩展错误:', event.reason);
      event.preventDefault(); // 阻止错误显示
      return;
    }
  });

  // 捕获未处理的错误
  const originalErrorHandler = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (isTalismanError(error) || (typeof message === 'string' && message.includes('Talisman'))) {
      console.warn('已忽略 Talisman 扩展错误:', message);
      return true; // 阻止默认错误处理
    }
    
    // 调用原始错误处理器
    if (originalErrorHandler) {
      return originalErrorHandler(message, source, lineno, colno, error);
    }
    return false;
  };
}






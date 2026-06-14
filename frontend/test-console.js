/**
 * 自动化测试脚本 - 捕获浏览器控制台输出
 * 
 * 使用方法：
 * 1. 确保前后端服务都在运行
 * 2. 运行：node test-console.js
 */

import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 启动浏览器...');
  
  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: false, // 显示浏览器窗口
    slowMo: 100,     // 放慢操作速度，便于观察
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  // 设置页面尺寸
  await page.setViewport({ width: 1920, height: 1080 });
  
  // 监听控制台输出
  console.log('\n📋 开始监听控制台输出...\n');
  
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    
    // 只显示我们关心的日志
    if (text.includes('🔄') || text.includes('📤') || text.includes('📥') || 
        text.includes('✅') || text.includes('❌')) {
      console.log(`[${type}] ${text}`);
    }
  });
  
  // 监听页面错误
  page.on('pageerror', err => {
    console.log('❌ 页面错误:', err.message);
  });
  
  // 监听网络请求
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/api/articles')) {
      console.log(`📤 网络请求：${request.method()} ${url}`);
    }
  });
  
  // 监听网络响应
  page.on('response', response => {
    const url = response.url();
    if (url.includes('/api/articles')) {
      console.log(`📥 网络响应：${response.status()} ${url}`);
    }
  });
  
  console.log('🌐 访问 http://localhost:5173/articles\n');
  
  // 访问文章列表页面
  await page.goto('http://localhost:5173/articles', {
    waitUntil: 'networkidle2',
    timeout: 15000
  });
  
  // 等待 5 秒，让所有日志输出
  console.log('\n⏳ 等待 5 秒，收集所有日志...\n');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // 获取页面内容
  const pageTitle = await page.$eval('h1', el => el.textContent).catch(() => '未找到标题');
  console.log('\n📄 页面标题:', pageTitle);
  
  // 检查页面所有文本内容
  const pageText = await page.evaluate(() => document.body.innerText);
  console.log('\n📄 页面文本内容预览:');
  console.log(pageText.substring(0, 500));
  
  // 检查是否有文章卡片（使用更通用的选择器）
  const articleElements = await page.$$('div[style*="cursor: pointer"]').catch(() => []);
  console.log('\n📊 可点击的文章元素数量:', articleElements.length);
  
  // 检查是否显示"暂无文章"
  const noArticles = await page.$eval('h2', el => el.textContent).catch(() => null);
  if (noArticles && noArticles.includes('暂无文章')) {
    console.log('⚠️ 页面显示：暂无文章');
  }
  
  // 检查是否有错误信息
  const errorElement = await page.$eval('div[style*="color: rgb(220, 53, 69)"]', el => el.textContent).catch(() => null);
  if (errorElement) {
    console.log('❌ 页面显示错误:', errorElement);
  }
  
  // 检查是否有加载动画
  const loadingElement = await page.$eval('div[style*="text-align: center"]', el => el.textContent).catch(() => null);
  if (loadingElement && loadingElement.includes('加载中')) {
    console.log('🔄 页面仍在加载中');
  }
  
  console.log('\n✅ 测试完成！\n');
  
  // 保持浏览器打开 10 秒，方便手动查看
  console.log('⏳ 浏览器将在 10 秒后关闭...');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  await browser.close();
  console.log('👋 浏览器已关闭');
  
})().catch(err => {
  console.error('❌ 测试失败:', err.message);
  console.error(err);
  process.exit(1);
});

import { watch } from 'chokidar';
import { exec } from 'child_process';
import { resolve } from 'path';

// 配置项
const config = {
  watchDir: './src', // 监听的目录（可修改为其他路径）
  buildCmd: 'pnpm build', // 触发的构建命令
  debounceTime: 10000, // 防抖时间（10s内多次修改只触发一次构建）
  ignored: ['**/node_modules/**', '**/.git/**'], // 忽略的文件/目录（可选）
};

// 防抖函数
let buildTimeout = null;
function debounceBuild() {
  clearTimeout(buildTimeout);
  buildTimeout = setTimeout(() => {
    console.log('\n📦 检测到文件变化，开始执行构建...');
    exec(config.buildCmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ 构建失败: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`⚠️ 构建警告:\n${stderr}`);
      }
      console.log(`✅ 构建完成！输出:\n${stdout}`);
    });
  }, config.debounceTime);
}

// 启动监听
console.log(`👀 开始监听目录: ${resolve(config.watchDir)}`);
watch(config.watchDir, {
  ignored: config.ignored, // 忽略不需要监听的文件
  persistent: true, // 持续监听
  ignoreInitial: true, // 初始扫描时不触发事件
}).on('all', (event, filePath) => {
  console.log(`🔄 检测到变化: ${event} → ${filePath}`);
  debounceBuild(); // 触发防抖构建
});
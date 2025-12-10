# 文件夹重命名说明

项目名称已统一更新为：**`fhevm-sealed-auction`**

## 📝 已更新的文件

以下文件中的项目名称已更新：
- ✅ `package.json` - 项目名称
- ✅ `README.md` - 项目结构说明
- ✅ `PROJECT_SUMMARY.md` - 项目总结

## 🔄 手动重命名文件夹

由于文件夹可能正在被使用（如 Cursor IDE 打开），需要手动重命名：

### 方法 1: 在文件资源管理器中重命名
1. 关闭 Cursor 或其他正在使用该文件夹的程序
2. 打开文件资源管理器
3. 导航到 `E:\code\fhe\`
4. 右键点击 `zamaTest` 文件夹
5. 选择"重命名"
6. 输入新名称：`fhevm-sealed-auction`

### 方法 2: 使用 PowerShell（关闭相关程序后）
```powershell
cd E:\code\fhe
Rename-Item -Path "zamaTest" -NewName "fhevm-sealed-auction"
```

### 方法 3: 使用命令行（关闭相关程序后）
```cmd
cd E:\code\fhe
ren zamaTest fhevm-sealed-auction
```

## ✅ 重命名后验证

重命名完成后，请确认：
- [ ] 文件夹名称已改为 `fhevm-sealed-auction`
- [ ] 所有文件中的项目名称引用已更新
- [ ] 项目可以正常打开和运行

## 📌 项目信息

- **项目名称**: fhevm-sealed-auction
- **中文名称**: 隐私保护密封投标拍卖系统
- **技术栈**: FHEVM + Solidity + Next.js + React
- **网络**: Sepolia 测试网


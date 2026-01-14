const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');

// МЫ УДАЛИЛИ ЗАПУСК ЛОКАЛЬНОГО СЕРВЕРА (require server.js)
// Теперь Electron - это просто клиент.

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1300,
        height: 850,
        minWidth: 1000,
        minHeight: 700,
        title: "TikTok Minecraft Bridge Pro (Client)",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false // Разрешаем загрузку локальных ресурсов и подключение к внешнему сокету
        },
        autoHideMenuBar: true,
        show: false,
        backgroundColor: '#0f172a',
        frame: false 
    });

    // Загружаем локальный файл вместо localhost
    win.loadFile('dashboard.html').then(() => {
        win.show();
    }).catch(e => console.error("Failed to load dashboard:", e));

    registerGlobalShortcuts();
}

app.whenReady().then(() => {
    createWindow();
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Регистрация глобальных горячих клавиш (Остается работать локально!)
function registerGlobalShortcuts() {
    
    const tryRegister = (acc, eventName) => {
        try {
            const ret = globalShortcut.register(acc, () => {
                if(win && !win.isDestroyed()) {
                    win.webContents.send(eventName);
                }
            });
            if (!ret) console.log(`Shortcut failed: ${acc}`);
        } catch(e) { 
            console.log(`Error registering ${acc}:`, e); 
        }
    };

    tryRegister('numadd', 'trigger-win-add'); 
    tryRegister('CommandOrControl+=', 'trigger-win-add'); 
    tryRegister('PageUp', 'trigger-win-add'); 

    tryRegister('numsub', 'trigger-win-rem'); 
    tryRegister('CommandOrControl+-', 'trigger-win-rem');
    tryRegister('PageDown', 'trigger-win-rem'); 

    tryRegister('nummult', 'trigger-timer-reset'); 
    tryRegister('CommandOrControl+Enter', 'trigger-timer-reset'); 
}
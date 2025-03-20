import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs-extra'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-extension-files',
      buildStart: async () => {
        // Ensure the content script is available
        const contentScriptPath = resolve(__dirname, 'src', 'contentScript.js');
        if (!fs.existsSync(contentScriptPath)) {
          console.warn('Content script not found at', contentScriptPath);
          
          // Create a basic content script if it doesn't exist
          const basicContentScript = `
          // Basic content script
          console.log("Profanity Filter content script loaded");
          
          // Message listener
          chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log("Content script received message:", message);
            sendResponse({ success: true });
            return true;
          });`;
          
          fs.writeFileSync(contentScriptPath, basicContentScript.trim());
        }
        
        // Ensure background script is available
        const backgroundScriptPath = resolve(__dirname, 'src', 'background.js');
        if (!fs.existsSync(backgroundScriptPath)) {
          console.warn('Background script not found at', backgroundScriptPath);
          
          // Create a basic background script if it doesn't exist
          const basicBackgroundScript = `
          // Basic background script
          console.log("Profanity Filter background script loaded");
          
          // Message listener
          chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log("Background script received message:", message);
            sendResponse({ success: true });
            return true;
          });`;
          
          fs.writeFileSync(backgroundScriptPath, basicBackgroundScript.trim());
        }
      },
      closeBundle: async () => {
        try {
          console.log("Copying extension files to dist...");
          
          // Create a manifest.json file
          const manifest = {
            "manifest_version": 3,
            "name": "Profanity Swapper",
            "version": "1.0.0",
            "description": "Detects and filters profanity on websites with highlighting and suggestions",
            "permissions": [
              "storage",
              "activeTab",
              "scripting",
              "tabs",
              "contextMenus"
            ],
            "host_permissions": [
              "<all_urls>"
            ],
            "background": {
              "service_worker": "background.js",
              "type": "module"
            },
            "content_scripts": [
              {
                "matches": ["<all_urls>"],
                "js": ["contentScript.js"],
                "run_at": "document_end",
                "all_frames": false
              }
            ],
            "action": {
              "default_popup": "index.html",
              "default_icon": {
                "16": "icons/icon16.png",
                "48": "icons/icon48.png",
                "128": "icons/icon128.png"
              }
            },
            "icons": {
              "16": "icons/icon16.png",
              "48": "icons/icon48.png",
              "128": "icons/icon128.png"
            },
            "web_accessible_resources": [
              {
                "resources": ["icons/*"],
                "matches": ["<all_urls>"]
              }
            ]
          };
          
          // Write manifest.json to dist
          fs.writeFileSync(
            resolve(__dirname, 'dist', 'manifest.json'),
            JSON.stringify(manifest, null, 2)
          );
          
          // Copy content script
          if (fs.existsSync(resolve(__dirname, 'src', 'contentScript.js'))) {
            fs.copyFileSync(
              resolve(__dirname, 'src', 'contentScript.js'),
              resolve(__dirname, 'dist', 'contentScript.js')
            );
          } else {
            console.warn('Content script not found, creating a placeholder');
            fs.writeFileSync(
              resolve(__dirname, 'dist', 'contentScript.js'),
              '// Placeholder content script\nconsole.log("Profanity Filter content script loaded");'
            );
          }
          
          // Copy background script
          if (fs.existsSync(resolve(__dirname, 'src', 'background.js'))) {
            fs.copyFileSync(
              resolve(__dirname, 'src', 'background.js'),
              resolve(__dirname, 'dist', 'background.js')
            );
          } else {
            console.warn('Background script not found, creating a placeholder');
            fs.writeFileSync(
              resolve(__dirname, 'dist', 'background.js'),
              '// Placeholder background script\nconsole.log("Profanity Filter background script loaded");'
            );
          }
          
          // Create icons directory
          fs.ensureDirSync(resolve(__dirname, 'dist', 'icons'));
          
          // Create placeholder icons if real ones don't exist
          const iconSizes = [16, 48, 128];
          for (const size of iconSizes) {
            const iconPath = resolve(__dirname, 'public', 'icons', `icon${size}.png`);
            const destPath = resolve(__dirname, 'dist', 'icons', `icon${size}.png`);
            
            if (fs.existsSync(iconPath)) {
              fs.copyFileSync(iconPath, destPath);
            } else {
              // Create an empty file as placeholder
              fs.writeFileSync(destPath, '');
            }
          }
          
          console.log("Extension files copied successfully!");
        } catch (error) {
          console.error("Error copying extension files:", error);
        }
      }
    }
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})

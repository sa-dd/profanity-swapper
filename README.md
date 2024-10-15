Run `npm install` to install all the dependencies.
Run `npm run dev` to start the development server.
To build the extension for Chrome, run `npm run build`. The built files will be in the `dist` directory.

To load the extension in Chrome:

Open Chrome and go to `chrome://extensions/`
Enable "Developer mode" in the top right corner.
Click "Load unpacked" and select the dist directory from your project.

This setup uses Vite for fast development and building, React for the UI, and Tailwind CSS for styling. The `manifest.json` file is set up for a basic Chrome extension.
You can now start making changes to the components. To switch between different pages, you can uncomment the desired component in `App.jsx` or implement a routing solution.

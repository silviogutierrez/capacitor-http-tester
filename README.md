1. Clone the repository.
2. Run `npm install` and `npm cap sync` to get both platforms working.
3. Run `npm run build && node server.js` to start the local server.
4. Open `http://localhost:3000` and see how everything works on the browser.
5. Run `npx cap open ios` and run the simulator, observe passing/failing tests.
6. Run `npx cap open android` and run the emulator, observe passing/failing tests

Issue numbers are linked to each test case.

Note: this uses plaintext on Android so HTTPS / certs are not tested.

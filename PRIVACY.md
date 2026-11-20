# Privacy Policy

**Last updated:** March 2026

## Landing Page (getdecluttr.app)

The Decluttr website does not collect any personal data. There are no analytics, cookies, or tracking scripts.

## Browser Extension

Decluttr stores all data locally in your browser using the built-in browser storage API. Specifically:

- **Tab data** is read from your browser's tab API during a session and is never transmitted anywhere.
- **Settings** (sort order, excluded domains, preferences) are saved locally using `browser.storage.local`.
- **Saved tabs** (the "Save for Later" feature) are stored locally using `browser.storage.local`.
- **Decision history** (which tabs you closed, kept or saved, with their title, URL and age) is stored locally using `browser.storage.local`, capped at the last 5,000 decisions.

### Command line bridge (optional, off by default)

If you turn on "Enable the decluttr CLI" in Settings and install the bridge, Decluttr talks to a small program on your own computer through the browser's native messaging API. That program keeps a copy of your decision history and exchanges requests in a folder on your computer (`~/.decluttr`). Nothing is sent over the network. Turning the setting off removes the permission; `bridge/install.sh --uninstall` removes the program.

Decluttr does **not**:

- Collect or transmit any personal information
- Use analytics or telemetry
- Communicate with any external servers
- Store any data outside your browser, unless you turn on the optional command line bridge, which stores it in a folder on your own computer

## Open Source

Decluttr is fully open source. You can inspect the code at [github.com/CytSoftware/decluttr](https://github.com/CytSoftware/decluttr).

## Contact

If you have questions about this policy, email [support@getdecluttr.app](mailto:support@getdecluttr.app).

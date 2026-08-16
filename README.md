<br />
<div align="center">
  <a href="https://github.com/Mezdia/EnPassant">
    <img width="115" height="115" src="https://github.com/Mezdia/EnPassant/blob/master/src-tauri/icons/icon.png" alt="Logo">
  </a>

<h3 align="center">EnPassant</h3>

  <p align="center">
    The Ultimate Chess Toolkit
    <br />
    <a href="https://www.enpassant.ir"><strong>enpassant.ir</strong></a>
    <br />
    <br />
    <a href="https://www.enpassant.ir/download">Download</a>
    ·
    <a href="https://www.enpassant.ir/docs">Explore the docs</a>
  </p>
</div>

EnPassant is an open-source, cross-platform chess GUI that aims to be powerful, customizable and easy to use.

## Features

- Store and analyze your games from [lichess.org](https://lichess.org) and [chess.com](https://chess.com)
- Multi-engine analysis. Supports all UCI engines
- Prepare a repertoire and train it with spaced repetition
- Simple engine and database installation and management
- Absolute or partial position search in the database

## Building from source

Refer to the [Tauri documentation](https://tauri.app/start/prerequisites/) for the requirements on your platform.

EnPassant uses pnpm as the package manager for dependencies. Refer to the [pnpm install instructions](https://pnpm.io/installation) for how to install it on your platform.

```bash
git clone https://github.com/Mezdia/EnPassant
cd EnPassant
pnpm install
pnpm build
```

The built app can be found at `src-tauri/target/release`

### Android

Building for Android additionally needs a JDK 17, the Android SDK (platform 34 and its build tools) and the NDK, with `NDK_HOME`/`ANDROID_HOME` pointing at them. `src-tauri/gen/` is not checked in, so the Gradle project is generated first:

```bash
pnpm tauri android init
cp -R src-tauri/icons/android/. src-tauri/gen/android/app/src/main/res/
pnpm tauri android build --apk --aab
```

Gradle writes unsigned release artifacts; `.github/scripts/sign-android.sh` aligns and signs them the same way CI does.

## Donate

If you wish to support the development of this GUI, you can do so [here](https://enpassant.ir/support). All donations are greatly appreciated!

## Contributing

For contributing to this project please refer to the [Contributing guide](./CONTRIBUTING.md).

## License

This software is licensed under GPL-3.0 License.

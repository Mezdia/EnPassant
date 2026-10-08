import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

// Android is the only target that reads its version out of tauri.conf.json:
// when `version` is absent the CLI writes no tauri.properties at all and Gradle
// silently falls back to versionCode 1 / versionName 1.0, which is how v0.15.0
// shipped an APK that reported itself as 1.0. Desktop keeps inheriting the
// version from Cargo.toml, so nothing else notices the drift.
const npmVersion: string = JSON.parse(read("package.json")).version;
const tauriVersion: string | undefined = JSON.parse(read("src-tauri/tauri.conf.json")).version;
const cargoVersion = /\[package\][\s\S]*?^version = "([^"]+)"/m.exec(
    read("src-tauri/Cargo.toml"),
)?.[1];

test("tauri.conf.json declares a version so Android gets a real versionCode", () => {
    expect(tauriVersion).toBeTruthy();
});

test("the version matches across package.json, Cargo.toml and tauri.conf.json", () => {
    expect(cargoVersion).toBe(npmVersion);
    expect(tauriVersion).toBe(npmVersion);
});

test("the version maps to a positive Android versionCode", () => {
    const [major, minor, patch] = npmVersion.split(".").map(Number);
    expect(major).not.toBeNaN();
    // Tauri computes major * 1_000_000 + minor * 1_000 + patch and rejects 0.
    expect(major * 1_000_000 + minor * 1_000 + patch).toBeGreaterThan(0);
});

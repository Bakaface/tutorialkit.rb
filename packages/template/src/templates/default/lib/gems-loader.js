/**
 * Gems tarball loader for the tarball distribution approach.
 *
 * This module handles extracting the gems.tar.gz tarball
 * from the public directory into the WebContainer filesystem.
 *
 * Flow:
 * 1. Read gems.tar.gz from filesystem
 * 2. Decompress gzip
 * 3. Extract tar to workspace/.gems/
 */

import fs from "fs/promises";
import { createReadStream, existsSync } from "fs";
import { createGunzip } from "zlib";
import { join, dirname } from "path";
import { pipeline } from "stream/promises";
import tar from "tar-stream";
import { bootProgress } from "./boot-progress.js";

// Paths in WebContainer filesystem
const workspaceDir = new URL("../workspace", import.meta.url).pathname;
const publicDir = new URL("../public", import.meta.url).pathname;
const gemsDir = join(workspaceDir, ".gems");
const extractedMarker = join(gemsDir, ".extracted");

// Tarball paths (filesystem)
const gemsTarballPath = join(publicDir, "gems.tar.gz");
const gemsMetadataPath = join(publicDir, "gems.meta.json");

/**
 * Check if gems tarball is available on the filesystem
 */
export async function hasGemsTarball() {
  return existsSync(gemsTarballPath);
}

/**
 * Check if gems have already been extracted
 */
export async function isGemsExtracted() {
  try {
    await fs.access(extractedMarker);
    return true;
  } catch {
    return false;
  }
}

/**
 * Load gems metadata from filesystem
 */
export async function loadGemsMetadata() {
  try {
    if (!existsSync(gemsMetadataPath)) return null;
    const content = await fs.readFile(gemsMetadataPath, "utf8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Extract gems tarball to workspace directory using tar-stream
 */
export async function extractGems(progress = bootProgress) {
  // Check if already extracted
  if (await isGemsExtracted()) {
    progress.log("Gems already extracted, skipping");
    return true;
  }

  // Check if tarball is available
  if (!await hasGemsTarball()) {
    progress.log("No gems.tar.gz found, skipping extraction");
    return false;
  }

  const extractionStart = performance.now();
  progress.updateStep("Loading gems...");

  // Load metadata for progress tracking
  const metadata = await loadGemsMetadata();
  const totalFiles = metadata?.file_count || 1000;

  // Get tarball size for progress
  const stats = await fs.stat(gemsTarballPath);
  progress.log(`Reading gems.tar.gz (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);
  progress.updateProgress(10);

  // Clean up any previous partial extraction
  await fs.rm(gemsDir, { recursive: true, force: true });
  await fs.mkdir(gemsDir, { recursive: true });

  progress.updateStep("Extracting gems...");
  progress.log(`Extracting to ${gemsDir}...`);

  // Extract using tar-stream
  let extractedCount = 0;
  const extract = tar.extract();

  extract.on("entry", async (header, stream, next) => {
    const targetPath = join(gemsDir, header.name);

    if (header.type === "directory") {
      await fs.mkdir(targetPath, { recursive: true });
      stream.resume();
      stream.on("end", next);
    } else if (header.type === "file") {
      // Ensure parent directory exists
      await fs.mkdir(dirname(targetPath), { recursive: true });

      // Collect chunks and write file, calling next() only after write completes
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", async () => {
        await fs.writeFile(targetPath, Buffer.concat(chunks));
        next();
      });
    } else {
      // Skip symlinks, etc.
      stream.resume();
      stream.on("end", next);
    }

    extractedCount++;
    if (extractedCount % 200 === 0) {
      const extractPercent = 20 + (extractedCount / totalFiles) * 75; // 20-95%
      progress.updateProgress(Math.min(extractPercent, 95));
    }
  });

  try {
    // Create pipeline: file -> gunzip -> tar extract
    await pipeline(
      createReadStream(gemsTarballPath),
      createGunzip(),
      extract
    );
  } catch (err) {
    // Clean up partial extraction so next boot gets a clean retry
    progress.log(`Extraction failed: ${err.message}`);
    await fs.rm(gemsDir, { recursive: true, force: true });
    throw err;
  }

  // Write marker file
  await fs.writeFile(extractedMarker, new Date().toISOString());

  const elapsed = ((performance.now() - extractionStart) / 1000).toFixed(1);
  progress.updateProgress(100);
  progress.log(`[boot] Extracted ${extractedCount} files (${elapsed}s)`);

  return true;
}

/**
 * Get the bundle path for extracted gems
 *
 * The gems tarball extracts directly to .gems/, creating structure:
 *   .gems/ruby/3.3.0/gems/...
 *   .gems/ruby/3.3.0/specifications/...
 *
 * IMPORTANT: This returns the Ruby-visible path (via WASI preopen),
 * not the WebContainer filesystem path. The gems directory is mounted
 * at /gems inside Ruby WASM.
 *
 * Bundler expects BUNDLE_PATH to point to the directory containing ruby/.
 */
export function getGemsBundlePath() {
  return "/gems";
}

/**
 * Get environment variables for using extracted gems
 */
export function getGemsEnv() {
  // Only set BUNDLE_PATH - let Bundler find Gemfile naturally from cwd
  return {
    BUNDLE_PATH: getGemsBundlePath(),
  };
}

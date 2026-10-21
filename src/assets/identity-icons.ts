/** Keyline Icons, MIT, commit 14cd695f3f2bbe320bbe7a01e65b251df7ba52cf.
 * The user-approved identity set: sharp/fill/{folder,file-text,file-image}
 * and sharp/stroke/folder-open. Geometry is licensed asset data, not newly
 * authored art. Keep IDs separate from Obsidian's Lucide registry.
 * See THIRD-PARTY-NOTICES.txt for source links and the retained licence.
 */
export const identityArtwork: Readonly<Record<string, { readonly path: string; readonly filled: boolean }>> = {
  "keyline-folder": { filled: true, path: "M3 3L9.5 3C9.7652 3 10.0196 3.1054 10.2071 3.2929L12.4142 5.5L21 5.5C21.5523 5.5 22 5.9477 22 6.5L22 20C22 20.5523 21.5523 21 21 21L3 21C2.4477 21 2 20.5523 2 20L2 4C2 3.4477 2.4477 3 3 3Z" },
  "keyline-folder-open": { filled: false, path: "M5.5528 15.8944L8 11L22 11L19.0753 20L2 20L2 4L8 4L10 6L19 6L19 12" },
  "keyline-file-text": { filled: true, path: "M14 1C14.2652 1 14.5196 1.1054 14.7071 1.2929L20.7071 7.2929C20.8946 7.4804 21 7.7348 21 8L21 22C21 22.5523 20.5523 23 20 23L4 23C3.4477 23 3 22.5523 3 22L3 2C3 1.4477 3.4477 1 4 1L14 1ZM7 18L17 18L17 16L7 16L7 18ZM7 14L13 14L13 12L7 12L7 14ZM15 8L20 8L14 2L14 7C14 7.5523 14.4477 8 15 8Z" },
  "keyline-file-image": { filled: true, path: "M14 1C14.2652 1 14.5196 1.1054 14.7071 1.2929L20.7071 7.2929C20.8946 7.4804 21 7.7348 21 8L21 22C21 22.5523 20.5523 23 20 23L4 23C3.4477 23 3 22.5523 3 22L3 2C3 1.4477 3.4477 1 4 1L14 1ZM15 8L20 8L14 2L14 7C14 7.5523 14.4477 8 15 8ZM5 17L9.4903 12.5097C9.7947 12.2053 10.2596 12.1299 10.6446 12.3224L19 16.5L19 20C19 20.5523 18.5523 21 18 21L6 21C5.4477 21 5 20.5523 5 20L5 17ZM10.5 7C10.5 6.1716 9.8284 5.5 9 5.5C8.1716 5.5 7.5 6.1716 7.5 7C7.5 7.8284 8.1716 8.5 9 8.5C9.8284 8.5 10.5 7.8284 10.5 7Z" }
};

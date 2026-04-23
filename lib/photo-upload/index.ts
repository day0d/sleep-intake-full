// Photo Upload Microservice
//
// Self-contained module for collecting and uploading bedroom/living-space photos
// as part of the sleep intake form. Mirrors the pattern in lib/storage/.
//
// To re-integrate into the active form:
//
//  1. Add PhotoKey to lib/types.ts and photoUrls: Partial<Record<PhotoKey, string>>
//     to FormData. Add photosSchema to lib/schema.ts fullFormSchema.
//
//  2. In app/page.tsx:
//     - Increase TOTAL_STEPS by 3
//     - Add photoBlobs state: useState<Partial<Record<PhotoKey, Blob>>>({})
//     - Add handlePhotoBlob callback (see git history for original implementation)
//     - Insert steps after Basics:
//         {step === 1 && <BedroomPhotos photoBlobs={photoBlobs} onPhotoBlob={handlePhotoBlob} />}
//         {step === 2 && <BedroomEnvironment photoBlobs={photoBlobs} onPhotoBlob={handlePhotoBlob} />}
//         {step === 3 && <LivingSpace photoBlobs={photoBlobs} onPhotoBlob={handlePhotoBlob} />}
//     - In handleSubmit, append blobs to FormData before POST:
//         for (const [key, blob] of Object.entries(photoBlobs)) {
//           if (blob) fd.append(`photo_${key}`, blob, `${key}.jpg`);
//         }
//
//  3. In app/api/submit/route.ts, restore the photo upload loop (see git history).
//
//  4. Update progress-bar.tsx SECTION_NAMES to include the 3 photo steps.
//
//  Storage: photos are submitted as multipart form blobs and handled server-side
//  via the lib/storage/ adapter. For direct client-side signed-URL uploads,
//  use uploadPhoto() from ./upload.ts (requires Supabase storage configured).

export { FileUpload } from "./file-upload";
export type { PhotoKey } from "./types";
export { photosSchema } from "./schema";
export type { PhotoUrls } from "./schema";
export { compressImage } from "./compress";
export { uploadPhoto } from "./upload";
export { BedroomPhotos } from "./steps/bedroom-photos";
export { BedroomEnvironment } from "./steps/bedroom-environment";
export { LivingSpace } from "./steps/living-space";

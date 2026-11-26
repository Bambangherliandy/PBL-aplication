export const TRISAKTI_LOGO_PATH = "/logokampus.png";

export async function renderTrisaktiLogoPNG(): Promise<{
  ab: ArrayBuffer;
  url: string;
  w: number;
  h: number;
} | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const w = img.naturalWidth || 600;
      const h = img.naturalHeight || 580;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        // Bersihkan kotak abu-abu checkerboard menjadi putih bersih
        const imgData = ctx.getImageData(0, 0, w, h);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
          if (d[i] > 170 && d[i + 1] > 170 && d[i + 2] > 170) {
            d[i] = 255;
            d[i + 1] = 255;
            d[i + 2] = 255;
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }

      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        blob.arrayBuffer().then((ab) =>
          resolve({
            ab,
            url: canvas.toDataURL("image/png"),
            w,
            h,
          })
        );
      }, "image/png");
    };
    img.onerror = () => resolve(null);
    img.src = TRISAKTI_LOGO_PATH;
  });
}
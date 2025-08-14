// Preview logo sebelum generate
document.getElementById("logoInput").addEventListener("change", function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById("logoPreview").src = e.target.result;
      document.getElementById("logoPreviewContainer").style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    document.getElementById("logoPreviewContainer").style.display = "none";
  }
});

function generateQR() {
  const qrType = document.getElementById("qrType").value;
  const qrInput = document.getElementById("qrInput").value.trim();
  const logoFile = document.getElementById("logoInput").files[0];
  const qrContainer = document.getElementById("qrcode");
  const downloadBtn = document.getElementById("downloadBtn");

  if (qrInput === "") {
    alert("⚠️ Masukkan teks atau link terlebih dahulu!");
    return;
  }

  qrContainer.innerHTML = "";
  downloadBtn.style.display = "none";

  let qrData = qrInput;
  if (qrType === "link" && !qrInput.startsWith("http")) {
    qrData = "https://" + qrInput;
  }

  // Generate QR sementara
  const tempDiv = document.createElement("div");
  new QRCode(tempDiv, {
    text: qrData,
    width: 300,
    height: 300,
    colorDark: "#000000",
    colorLight: "#ffffff"
  });

  setTimeout(() => {
    const qrImg = tempDiv.querySelector("img");
    if (!qrImg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size = 300;
    canvas.width = size;
    canvas.height = size;

    const qrImage = new Image();
    qrImage.src = qrImg.src;
    qrImage.onload = () => {
      ctx.drawImage(qrImage, 0, 0, size, size);

      if (logoFile) {
        const reader = new FileReader();
        reader.onload = e => {
          const logo = new Image();
          logo.src = e.target.result;
          logo.onload = () => {
            const logoSize = size * 0.25;
            const x = (size - logoSize) / 2;
            const y = (size - logoSize) / 2;

            ctx.fillStyle = "white";
            ctx.fillRect(x, y, logoSize, logoSize); 
            ctx.drawImage(logo, x, y, logoSize, logoSize);

            showFinalQR(canvas, qrContainer, downloadBtn);
          };
        };
        reader.readAsDataURL(logoFile);
      } else {
        showFinalQR(canvas, qrContainer, downloadBtn);
      }
    };
  }, 300);
}

function showFinalQR(canvas, container, btn) {
  container.innerHTML = "";
  const finalImg = new Image();
  finalImg.src = canvas.toDataURL("image/png");
  container.appendChild(finalImg);
  btn.href = finalImg.src;
  btn.style.display = "inline-block";
}
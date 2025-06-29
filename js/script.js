// --- All Converter Definitions ---

const converters = {
  alik2: {
    title: "گهورینا (عەلی-ک) بو یونیکود",
    placeholder: "نڤیسینا 'عەلی-ک' ل ڤێرە بنڤیسە...",
    convert: function (legacyText) {
      const map = {
        لاَ: "ڵا",
        لآ: "ڵا",
        لاً: "ڵا",
        لَ: "ڵ",
        لً: "ڵ",
        لأ: "ڵ",
        رِ: "ڕ",
        يَ: "ێ",
        ىَ: "ێ",
        وَ: "ۆ",
        "ِ": "",
        ي: "ی",
        ى: "ی",
        ؤ: "ۆ",
        ذ: "ژ",
        ض: "چ",
        ط: "گ",
        ظ: "ڤ",
        ث: "پ",
        ة: "ه‌",
      };
      let modernText = legacyText;
      for (const [legacy, modern] of Object.entries(map)) {
        modernText = modernText.replace(new RegExp(legacy, "g"), modern);
      }
      return modernText;
    },
  },
  aliweb: {
    title: "گهورینا (عەلی وێب) بو یونیکود",
    placeholder: "نڤیسینا 'عەلی وێب' ل ڤێرە بنڤیسە...",
    convert: function (legacyText) {
      let modernText = legacyText;
      // Handle the complex three-way swap first using a placeholder
      const tempPlaceholder = "§";
      modernText = modernText.replace(/ط/g, tempPlaceholder); // ط -> §
      modernText = modernText.replace(/گ/g, "ط"); // گ -> ط
      modernText = modernText.replace(/ڭ/g, "گ"); // ڭ -> گ
      modernText = modernText.replace(new RegExp(tempPlaceholder, "g"), "ڭ"); // § -> ڭ

      const map = {
        لاَ: "ڵا",
        لآ: "ڵا",
        لاً: "ڵا",
        لَ: "ڵ",
        پ: "ڵ",
        رِ: "ڕ",
        أ: "ڕ",
        ؤ: "ۆ",
        وَ: "ۆ",
        يَ: "ێ",
        یَ: "ێ",
        ص: "ێ",
        ة: "ە",
        ه: "ھ",
        ي: "ی",
        ض: "چ",
        ث: "پ",
        ظ: "ڤ",
        "ْ": "",
        "ُ": "",
        ى: "*",
        ك: "ک",
        ذ: "ژ",
      };
      for (const [legacy, modern] of Object.entries(map)) {
        modernText = modernText.replace(new RegExp(legacy, "g"), modern);
      }
      return modernText;
    },
  },
  dylan: {
    title: "گهورینا (دیلان) بو یونیکود",
    placeholder: "نڤیسینا 'دیلان' ل ڤێرە بنڤیسە...",
    convert: function (legacyText) {
      const map = {
        لإ: "ڵا",
        لأ: "ڵا",
        لآ: "ڵا",
        وَ: "ۆ",
        ؤ: "ۆ",
        ة: "ە",
        ض: "ڤ",
        ص: "ڵ",
        ث: "ێ",
        ه: "ھ",
        ك: "ک",
        ي: "ی",
        ى: "ی",
        ذ: "ڕ",
      };
      let modernText = legacyText;
      for (const [legacy, modern] of Object.entries(map)) {
        modernText = modernText.replace(new RegExp(legacy, "g"), modern);
      }
      return modernText;
    },
  },
  zarnegar: {
    title: "گهورینا (زەڕنەگار) بو یونیکود",
    placeholder: "نڤیسینا 'زەڕنەگار' ل ڤێرە بنڤیسە...",
    convert: function (legacyText) {
      const map = {
        // Order is important
        لاٌ: "ڵا",
        يٌ: "ێ",
        یٌ: "ێ",
        "ه‏": "ە", // Note: The second char is an invisible RIGHT-TO-LEFT MARK (U+200F)
        لٌ: "ڵ",
        رٍ: "ڕ",
        وٌ: "ۆ",
        ى: "ی",
        ي: "ی",
      };
      let modernText = legacyText;
      for (const [legacy, modern] of Object.entries(map)) {
        modernText = modernText.replace(new RegExp(legacy, "g"), modern);
      }
      return modernText;
    },
  },
};

// --- DOM Element Selection ---
const mainTitle = document.getElementById("main-title");
const mainSubtitle = document.getElementById("main-subtitle");
const converterOptions = document.querySelector(".converter-options");
const legacyInput = document.getElementById("legacy-input");
const modernOutput = document.getElementById("modern-output");
const copyBtn = document.getElementById("copy-btn");
const clearBtn = document.getElementById("clear-btn");
let debounceTimer;

// --- Core Functions ---

function getSelectedConverterKey() {
  return document.querySelector('input[name="converter-type"]:checked').value;
}

function performConversion() {
  const selectedKey = getSelectedConverterKey();
  const converter = converters[selectedKey];
  const legacyText = legacyInput.value;
  const convertedText = converter.convert(legacyText);
  modernOutput.value = convertedText;
}

function updateUI() {
  const selectedKey = getSelectedConverterKey();
  const converter = converters[selectedKey];

  // Update text content
  mainTitle.textContent = converter.title;
  mainSubtitle.textContent = converter.subtitle;

  // *** CHANGE: Set the placeholder instead of value ***
  legacyInput.placeholder = converter.placeholder;

  // *** CHANGE: Clear the text areas when switching modes ***
  legacyInput.value = "";
  modernOutput.value = "";
}

// --- Event Listeners ---

// Automatic conversion on input with a debounce to improve performance
legacyInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(performConversion, 200);
});

// Update UI when user changes converter type
converterOptions.addEventListener("change", updateUI);

// Copy button functionality
copyBtn.addEventListener("click", () => {
  if (modernOutput.value) {
    navigator.clipboard
      .writeText(modernOutput.value)
      .then(() => {
        copyBtn.textContent = "هاتە کوپی کرن";
        copyBtn.classList.add("copied");
        setTimeout(() => {
          copyBtn.textContent = "کوپیکرنا ئەنجامی";
          copyBtn.classList.remove("copied");
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        alert("کوپی کرن یا سەرکەفتی نەبوو");
      });
  }
});

// Clear button functionality
clearBtn.addEventListener("click", () => {
  legacyInput.value = "";
  modernOutput.value = "";
  legacyInput.focus();
});

// --- Initial Setup on Page Load ---
document.addEventListener("DOMContentLoaded", () => {
  updateUI(); // Set initial title, subtitle, and placeholder
});

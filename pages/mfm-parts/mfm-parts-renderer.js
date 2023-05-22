const parts1Btn = document.getElementById("parts1")
const parts2Btn = document.getElementById("parts2")
const parts3Btn = document.getElementById("parts3")
const parts4Btn = document.getElementById("parts4")
const parts5Btn = document.getElementById("parts5")
let partsData;

document.addEventListener("DOMContentLoaded", async () => {
  const data = {
    namespace: "mfm-parts",
    key: "PARTS-TITLE",
  };
  document.getElementById(data.key).textContent = await window.langAPI._t(data);

  data.key = "PARTS-DATA"
  partsData = await window.langAPI._t(data)
  // console.dir(partsData)
  document.getElementById("img-thumbnail-size1").innerHTML = partsData["1"].size
  document.getElementById("img-thumbnail-plateThickness1").innerHTML = partsData["1"].plateThickness
  document.getElementById("img-thumbnail-features1").innerHTML = partsData["1"].features
  document.getElementById("img-thumbnail-size2").innerHTML = partsData["2"].size
  document.getElementById("img-thumbnail-plateThickness2").innerHTML = partsData["2"].plateThickness
  document.getElementById("img-thumbnail-features2").innerHTML = partsData["2"].features
  document.getElementById("img-thumbnail-size3").innerHTML = partsData["3"].size
  document.getElementById("img-thumbnail-plateThickness3").innerHTML = partsData["3"].plateThickness
  document.getElementById("img-thumbnail-features3").innerHTML = partsData["3"].features
  document.getElementById("img-thumbnail-size4").innerHTML = partsData["4"].size
  document.getElementById("img-thumbnail-plateThickness4").innerHTML = partsData["4"].plateThickness
  document.getElementById("img-thumbnail-features4").innerHTML = partsData["4"].features
  document.getElementById("img-thumbnail-size5").innerHTML = partsData["5"].size
  document.getElementById("img-thumbnail-plateThickness5").innerHTML = partsData["5"].plateThickness
  document.getElementById("img-thumbnail-features5").innerHTML = partsData["5"].features

});

parts1Btn.addEventListener("click",  async () => {
  await window.electronAPI.setMfmParts(partsData["1"])
  await window.partsAPI.partsChangeToParent({ partsNumber: "1" });

  window.parts.close()
});

parts2Btn.addEventListener("click",  async () => {
  await window.electronAPI.setMfmParts(partsData["2"])
  await window.partsAPI.partsChangeToParent({ partsNumber: "2" });

  window.parts.close()
});

parts3Btn.addEventListener("click",  async () => {
  await window.electronAPI.setMfmParts(partsData["3"])
  await window.partsAPI.partsChangeToParent({ partsNumber: "3" });

  window.parts.close()
});

parts4Btn.addEventListener("click",  async () => {
  await window.electronAPI.setMfmParts(partsData["4"])
  await window.partsAPI.partsChangeToParent({ partsNumber: "4" });

  window.parts.close()
});

parts5Btn.addEventListener("click",  async () => {
  await window.electronAPI.setMfmParts(partsData["5"])
  await window.partsAPI.partsChangeToParent({ partsNumber: "5" });

  window.parts.close()
});

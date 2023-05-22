const parts1Btn = document.getElementById("parts1")
const parts2Btn = document.getElementById("parts2")
const parts3Btn = document.getElementById("parts3")
const parts4Btn = document.getElementById("parts4")

document.addEventListener("DOMContentLoaded", async () => {
  const data = {
    namespace: "parts",
    key: "PARTS-TITLE",
  };

  document.getElementById(data.key).textContent = await window.langAPI._t(data);
  data.key = "PARTS-DATA"
  const partsData = await window.langAPI._t(data)
  document.getElementById("parts1").disabled = true
  document.getElementById("parts2").disabled = true
  document.getElementById("parts3").disabled = true
  document.getElementById("parts4").disabled = true
  document.getElementById("parts1").style = "display:none;"
  document.getElementById("parts2").style = "display:none;"
  document.getElementById("parts3").style = "display:none;"
  document.getElementById("parts4").style = "display:none;"

  const model1ValidateParts = await window.electronAPI.getConfig("model1ValidateParts")
  const model2ValidateParts = await window.electronAPI.getConfig("model2ValidateParts")
  const selectPartsValue = await window.electronAPI.getConfig("selectPartsValue")

  console.log("parts:model1ValidateParts:" + JSON.stringify(model1ValidateParts))
  console.log("parts:model2ValidateParts:" + JSON.stringify(model2ValidateParts))
  console.log("parts:selectPartsValue:" + JSON.stringify(selectPartsValue))

  let model1Parts1ValidatePlateThickness = null
  let model1Parts2ValidatePlateThickness = null
  let model1Parts3ValidatePlateThickness = null
  let model1Parts4ValidatePlateThickness = null
  let model2Parts1ValidatePlateThickness = null
  let model2Parts2ValidatePlateThickness = null
  let model2Parts3ValidatePlateThickness = null
  let model2Parts4ValidatePlateThickness = null

  console.log("(Array.isArray(selectPartsValue)...:" + (Array.isArray(selectPartsValue) ? (selectPartsValue.length == 0) : false))
  if ((Array.isArray(selectPartsValue) ? (selectPartsValue.length == 0) : false)) {
    for (const key in model1ValidateParts) {
      console.log("Object.assign({},model1ValidateParts[key]):" + JSON.stringify(Object.assign({},model1ValidateParts[key])))
      console.log("model1ValidateParts[key]:" + JSON.stringify(model1ValidateParts[key]))
      console.log("partsData[key]:" + JSON.stringify(partsData[key]))
      if (key == "1") {
        window.electronAPI.setConfig({key:"model1Parts1ValidatePlateThickness",data:Object.assign({},model1ValidateParts[key])})
        model1Parts1ValidatePlateThickness = Object.assign({},model1ValidateParts[key])
      } else if (key == "2") {
        window.electronAPI.setConfig({key:"model1Parts2ValidatePlateThickness",data:Object.assign({},model1ValidateParts[key])})
        model1Parts2ValidatePlateThickness = Object.assign({},model1ValidateParts[key])
      } else if (key == "3") {
        window.electronAPI.setConfig({key:"model1Parts3ValidatePlateThickness",data:Object.assign({},model1ValidateParts[key])})
        model1Parts3ValidatePlateThickness = Object.assign({},model1ValidateParts[key])
      } else if (key == "4") {
        window.electronAPI.setConfig({key:"model1Parts4ValidatePlateThickness",data:Object.assign({},model1ValidateParts[key])})
        model1Parts4ValidatePlateThickness = Object.assign({},model1ValidateParts[key])
      }
    }
  
    for (const key in model2ValidateParts) {
      console.log("Object.assign({},model2ValidateParts[key]):" + JSON.stringify(Object.assign({},model2ValidateParts[key])))
      console.log("model2ValidateParts[key]:" + JSON.stringify(model2ValidateParts[key]))
      if (key == "1") {
        window.electronAPI.setConfig({key:"model2Parts1ValidatePlateThickness",data:Object.assign({},model2ValidateParts[key])})
        model2Parts1ValidatePlateThickness = Object.assign({},model2ValidateParts[key])
      } else if (key == "2") {
        window.electronAPI.setConfig({key:"model2Parts2ValidatePlateThickness",data:Object.assign({},model2ValidateParts[key])})
        model2Parts2ValidatePlateThickness = Object.assign({},model2ValidateParts[key])
      } else if (key == "3") {
        window.electronAPI.setConfig({key:"model2Parts3ValidatePlateThickness",data:Object.assign({},model2ValidateParts[key])})
        model2Parts3ValidatePlateThickness = Object.assign({},model2ValidateParts[key])
      } else if (key == "4") {
        window.electronAPI.setConfig({key:"model2Parts4ValidatePlateThickness",data:Object.assign({},model2ValidateParts[key])})
        model2Parts4ValidatePlateThickness = Object.assign({},model2ValidateParts[key])
      }
    }
    if (model1Parts1ValidatePlateThickness != null && model2Parts1ValidatePlateThickness != null) {
      document.getElementById("parts1").disabled = false
      document.getElementById("parts1").style = "display:contents;"
      document.getElementById("img-thumbnail-size1").innerHTML = partsData["1"].size
      document.getElementById("img-thumbnail-features1").innerHTML = partsData["1"].features
    }
    if (model1Parts2ValidatePlateThickness != null && model2Parts2ValidatePlateThickness != null) {
      document.getElementById("parts2").disabled = false
      document.getElementById("parts2").style = "display:contents;"
      document.getElementById("img-thumbnail-size2").innerHTML = partsData["2"].size
      document.getElementById("img-thumbnail-features2").innerHTML = partsData["2"].features
    }
    if (model1Parts3ValidatePlateThickness != null && model2Parts3ValidatePlateThickness != null) {
      document.getElementById("parts3").disabled = false
      document.getElementById("parts3").style = "display:contents;"
      document.getElementById("img-thumbnail-size3").innerHTML = partsData["3"].size
      document.getElementById("img-thumbnail-features3").innerHTML = partsData["3"].features
    }
    if (model1Parts4ValidatePlateThickness != null && model2Parts4ValidatePlateThickness != null) {
      document.getElementById("parts4").disabled = false
      document.getElementById("parts4").style = "display:contents;"
      document.getElementById("img-thumbnail-size4").innerHTML = partsData["4"].size
      document.getElementById("img-thumbnail-features4").innerHTML = partsData["4"].features
    }
    
  } else {
    selectPartsValue.forEach(value => {
      if (value == "1") {
        document.getElementById("parts1").disabled = false
        document.getElementById("parts1").style = "display:contents;"
        document.getElementById("img-thumbnail-size1").innerHTML = partsData["1"].size
        document.getElementById("img-thumbnail-features1").innerHTML = partsData["1"].features
        } else if (value == "2") {
        document.getElementById("parts2").disabled = false
        document.getElementById("parts2").style = "display:contents;"
        document.getElementById("img-thumbnail-size2").innerHTML = partsData["2"].size
        document.getElementById("img-thumbnail-features2").innerHTML = partsData["2"].features
        } else if (value == "3") {
        document.getElementById("parts3").disabled = false
        document.getElementById("parts3").style = "display:contents;"
        document.getElementById("img-thumbnail-size3").innerHTML = partsData["3"].size
        document.getElementById("img-thumbnail-features3").innerHTML = partsData["3"].features
        } else if (value == "4") {
        document.getElementById("parts4").disabled = false
        document.getElementById("parts4").style = "display:contents;"
        document.getElementById("img-thumbnail-size4").innerHTML = partsData["4"].size
        document.getElementById("img-thumbnail-features4").innerHTML = partsData["4"].features
        }      
    }); 
  }

});

parts1Btn.addEventListener("click",  async () => {
  await window.electronAPI.setParts("1")
  await window.partsAPI.partsChangeToParent({ partsNumber: "1" });

  window.parts.close()
});

parts2Btn.addEventListener("click",  async () => {
  await window.electronAPI.setParts("2")
  await window.partsAPI.partsChangeToParent({ partsNumber: "2" });

  window.parts.close()
});

parts3Btn.addEventListener("click",  async () => {
  await window.electronAPI.setParts("3")
  await window.partsAPI.partsChangeToParent({ partsNumber: "3" });

  window.parts.close()
});

parts4Btn.addEventListener("click",  async () => {
  await window.electronAPI.setParts("4")
  await window.partsAPI.partsChangeToParent({ partsNumber: "4" });

  window.parts.close()
});

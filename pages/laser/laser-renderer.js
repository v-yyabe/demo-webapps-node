// タッチイベント利用判定
var supportTouch = "ontouchend" in document;

// イベント設定
var EVENTNAME_TOUCHSTART = supportTouch ? "touchstart" : "mousedown";
var EVENTNAME_TOUCHMOVE = supportTouch ? "touchmove" : "mousemove";
var EVENTNAME_TOUCHEND = supportTouch ? "touchend" : "mouseup";

const partsSelect = document.getElementById("partsSelect");
const filePathElement = document.getElementById("filePath");
const settingsBtn = document.getElementById("settings-btn");
const minimizeBtn = document.getElementById("minimize-btn");
const forwardToggleBtn = document.getElementById("forward-toggle-btn");
const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");
const selectMaterial1 = document.getElementById("SELECT-MATERIAL1");
const selectAssistGas1 = document.getElementById("SELECT-ASSISTGAS1");
const selectMaterial2 = document.getElementById("SELECT-MATERIAL2");
const selectAssistGas2 = document.getElementById("SELECT-ASSISTGAS2");
const selectModel1 = document.getElementById("SELECT-MODEL1");
const selectModel2 = document.getElementById("SELECT-MODEL2");
const selectOscillator1 = document.getElementById("SELECT-OSCILLATOR1");
const selectOscillator2 = document.getElementById("SELECT-OSCILLATOR2");
const selectPlateThickness = document.getElementById("SELECT-PLATETHICKNESS");
const homeAnchor = document.getElementById("homeAnchor");
const video1HTML = document.getElementById("VIDEO-CONTROLS1").children[0]
let video2HTML = document.getElementById("VIDEO-CONTROLS2").children[0]
const displayModelChange = document.getElementById("displayModelChange")

const svgPlay = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-play' viewBox='0 0 16 16'><path d='M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z'/></svg>"
const svgPause = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-pause' viewBox='0 0 16 16'><path d='M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z'/></svg>"

const getDuplicateValues = ([...array]) => {
  return array.filter((value, index, self) => self.indexOf(value) === index && self.lastIndexOf(value) !== index);
};

const convertTime = function(time_position) {
    
  time_position = Math.floor(time_position);
  var res = null;

  if( 60 <= time_position ) {
    res = Math.floor(time_position / 60);
    res += ":" + Math.floor(time_position % 60).toString().padStart( 2, '0');
  } else {
    res = "0:" + Math.floor(time_position % 60).toString().padStart( 2, '0');
  }

  return res;
};

/**
 * 工場実マシンリストを更新する
 * @param {*} mObj
 */
const appendRealMachineList = async (mObj) => {
  if (!mObj) return;
  // 工場実マシンリストをクリアする
  // clearMachineList();
  if (!mObj.length && mObj.name) {
    mObj = [mObj];
  }
  let realMachineList = {}
  // リアルマシンリストに取得した情報を保存する
  for (let m = 0; m < mObj.length; m += 1) {
    let description = '';
    let amada_type = '';
    let process_type = '';
    let machine_type = '';
    let machine_model = '';

    // Descriptionのデータ項目(実マシンID)を取得する
    for (let f = 0; f < mObj[m].feature.length; f += 1) {
      if (mObj[m].feature[f].name === 'Description') {
        description = mObj[m].feature[f].value;
        // appendFactoryMachineItem({ id: mObj[m].id, real_desc: description });
      }
      if (mObj[m].feature[f].name === 'ProcessGroupType') {
        process_type = mObj[m].feature[f].value;
      }
      if (mObj[m].feature[f].name === 'AmadaType') {
        amada_type = mObj[m].feature[f].value;
      }
      if (mObj[m].feature[f].name === 'MachineTypeCode') {
        machine_type = mObj[m].feature[f].value;
      }
      if (mObj[m].feature[f].name === 'MachineModel') {
        machine_model = mObj[m].feature[f].value;
      }
      if (description && machine_model) {
        console.log(
          {
            id: mObj[m].id,
            name: mObj[m].name,
            object_type: mObj[m].type,
            process_type,
            amada_type,
            machine_type,
            machine_model,
            real_desc: description,
          }            
        )
        if ( amada_type == "Laser") {
          realMachineList[mObj[m].id] = 
          {
            id: mObj[m].id,
            name: mObj[m].name,
            object_type: mObj[m].type,
            process_type,
            amada_type,
            machine_type,
            machine_model,
            real_desc: description,
          }            
        }
        break;
      }
    }
  }
  return realMachineList
}

window.electronAPI.onFactoryConfigurationResponse(async (_event, callback) => {
  console.log("onFactoryConfigurationResponse:callback" + JSON.stringify(callback));
  console.log("onFactoryConfigurationResponse:_event" + JSON.stringify(_event));
  const dataTempObj = await window.electronAPI.getConfig("factoryConfiguration")
  
  console.log("dataTempObj:" + JSON.stringify(dataTempObj));    
  const targetMachine = [];
  let realMachineList = [];
  if (JSON.stringify(dataTempObj) != undefined) {
    console.dir(dataTempObj.amadaObject);
    if( dataTempObj.amadaObject != undefined ){
      for (let d = 0; d < dataTempObj.amadaObject.length; d += 1) {
        if (dataTempObj.amadaObject[d].type === "Folder") {
          const tmp_mac_list = dataTempObj.amadaObject[d].amadaObject;
          if (!tmp_mac_list) continue; // eslint-disable-line no-continue
          for (let m = 0; m < tmp_mac_list.length; m += 1) {
            const chkec_machine = tmp_mac_list[m];
            if (chkec_machine.type === "AMNC") {
              // if ((chkec_machine.type === "AMNC" || chkec_machine.type === "AMADA D I/O")) {
              let all_attr_check = 0;
              for (let f = 0; f < chkec_machine.feature.length; f += 1) {
                if (chkec_machine.feature[f].name === "ProcessGroupType" && chkec_machine.feature[f].value) {
                  all_attr_check += 1;
                } else if (chkec_machine.feature[f].name === "AmadaType" && chkec_machine.feature[f].value) {
                  all_attr_check += 1;
                } else if (chkec_machine.feature[f].name === "MachineTypeCode" && chkec_machine.feature[f].value) {
                  all_attr_check += 1;
                }
                if (all_attr_check === 3) {
                  targetMachine.push(chkec_machine);
                  break;
                }
              }
            }
          }
        } else {
          continue;
        }
      }
    }
    realMachineList = await appendRealMachineList(targetMachine);
  }
  // 実マシン設定
  console.log("realMachineList:" + JSON.stringify(realMachineList))

  const laserKey = {
    namespace: "laser",
    key: "SELECT-DISPLAY-MODEL-TITLE"
  }
  const title = await window.langAPI._t(laserKey)
  laserKey.key = "SELECT-DISPLAY-MODEL-MESSAGE"
  const message = await window.langAPI._t(laserKey)
  const element = document.getElementById("VIDEO-CONTROLS2").children[0]
  const selectDisplayModel = document.getElementById("SELECT-DISPLAY-MODEL")
  const forwardToggleDiv = document.getElementById("forward-toggle-div")
  const playDiv = document.getElementById("play-div")
  const model2 = await window.electronAPI.getConfig("model2")
  const oscillator2 = await window.electronAPI.getConfig("oscillator2")
  console.log("element:" + element)
  console.log("selectDisplayModel:" + selectDisplayModel)
  console.log("model2:" + model2)
  if ( selectDisplayModel == undefined ) {
    const divDisplayModelNew = document.createElement("div")
    const selectDisplayModelNew = document.createElement("select")
    for (const index in realMachineList) {
      const selectDisplayModelOption = document.createElement("option")
      console.log("realMachineList[" + index + "]" + realMachineList[index])
      selectDisplayModelOption.value = index
      selectDisplayModelOption.textContent = realMachineList[index].name
      console.dir(selectDisplayModelOption)
      selectDisplayModelNew.appendChild(selectDisplayModelOption)
    }

    const divDisplayTitleNew = document.createElement("div")
    divDisplayTitleNew.classList.add("col")
    const divDisplayMessageNew = document.createElement("div")
    divDisplayMessageNew.classList.add("col")
    selectDisplayModelNew.id = "SELECT-DISPLAY-MODEL"
    divDisplayModelNew.appendChild(selectDisplayModelNew)
    divDisplayModelNew.classList.add("col")
    document.getElementById("VIDEO-LABEL-MODEL2").innerHTML = ""
    document.getElementById("VIDEO-CONTROLS2").innerHTML = ""
    document.getElementById("VIDEO-TIME-MODEL2").innerHTML = "- : -"
    document.getElementById("VIDEO-CONTROLS2").appendChild(divDisplayTitleNew)
    document.getElementById("VIDEO-CONTROLS2").appendChild(divDisplayModelNew)
    document.getElementById("VIDEO-CONTROLS2").appendChild(divDisplayMessageNew)
    document.getElementById("VIDEO-CONTROLS2").classList.remove("video_wrapper")
    document.getElementById("VIDEO-CONTROLS2").classList.remove("ratio")
    document.getElementById("VIDEO-CONTROLS2").classList.remove("ratio-16x9")
    document.getElementById("VIDEO-CONTROLS2").classList.add("row")
    document.getElementById("VIDEO-CONTROLS2").classList.add("row-cols-1")
    divDisplayTitleNew.innerHTML = title
    divDisplayTitleNew.style = "font-weight: bold;"
    divDisplayMessageNew.innerHTML = message
    forwardToggleDiv.style = "display:none;"
    playDiv.style = "display:none;"
    const selectMaterial2 = document.getElementById("SELECT-MATERIAL2");
    const selectAssistGas2 = document.getElementById("SELECT-ASSISTGAS2");
    const selectModel2 = document.getElementById("SELECT-MODEL2");
    const selectOscillator2 = document.getElementById("SELECT-OSCILLATOR2");
    selectMaterial2.disabled = true
    selectAssistGas2.disabled = true
    selectModel2.disabled = true
    selectOscillator2.disabled = true

  } else {
    const laser = {
      namespace: "laser",
      key: "VIDEO-LABEL-MODEL2"
    }
    if (model2 == "") {
      document.getElementById(laser.key).innerHTML = await window.langAPI._t(laser)
    } else {
      document.getElementById("VIDEO-LABEL-MODEL2").innerHTML = model2 + "(" + oscillator2 + "kW)"
    }
  
    document.getElementById("VIDEO-CONTROLS2").innerHTML = ""
    document.getElementById("VIDEO-CONTROLS2").classList.add("video_wrapper")
    document.getElementById("VIDEO-CONTROLS2").classList.add("ratio")
    document.getElementById("VIDEO-CONTROLS2").classList.add("ratio-16x9")
    const video = document.createElement("video")
    video.controls = true
    document.getElementById("VIDEO-CONTROLS2").appendChild(video)
    video2HTML = document.getElementById("VIDEO-CONTROLS2").children[0]

    const plateThicknessValidateVideo2 = await window.electronAPI.getConfig("plateThicknessValidateVideo2")
  
    console.log("laser:plateThicknessValidateVideo2:" + JSON.stringify(plateThicknessValidateVideo2))
  
    document.getElementById("VIDEO-TIME-MODEL2").innerHTML = "00:00"
    const plateThicknessValue = await window.electronAPI.getConfig("platethickness")
    const video2 = plateThicknessValidateVideo2[plateThicknessValue]
    if (video2 != null) {
      console.log("video2:"+video2)
      video2HTML.src = video2
      video2HTML.type ="video/mp4"
      console.dir(video2HTML)
      video2HTML.load()
    }
  
    video2HTML.addEventListener("durationchange", function(){
      document.getElementById("VIDEO-TIME-MODEL2").innerHTML = convertTime(this.duration)
    });
    video2HTML.addEventListener("timeupdate", function(){
      document.getElementById("VIDEO-TIME-MODEL2").innerHTML = convertTime(this.currentTime) + "/" + convertTime(this.duration)
    });
    
    video2HTML.addEventListener("canplay", function(){
      console.log("video2:canplay")
    });
    video2HTML.addEventListener("ended", async () => {
      video2HTML.currentTime = 0
      if(video1HTML.currentTime == 0) {
        video1HTML.currentTime = 0
        document.getElementById("forward-label").innerHTML = "&#215;1 speed"
        await window.electronAPI.setVideoSpeed("1.0")
        document.getElementById("play-btn").innerHTML = svgPlay
        await window.electronAPI.isVideoPlay(false)  
      }
    });

    forwardToggleDiv.style = "display:contents;"
    playDiv.style = "display:contents;"

    const selectMaterial2 = document.getElementById("SELECT-MATERIAL2");
    const selectAssistGas2 = document.getElementById("SELECT-ASSISTGAS2");
    const selectModel2 = document.getElementById("SELECT-MODEL2");
    const selectOscillator2 = document.getElementById("SELECT-OSCILLATOR2");
    selectMaterial2.disabled = false
    selectAssistGas2.disabled = false
    selectModel2.disabled = false
    selectOscillator2.disabled = false

    let html = "No Data"
    html = await window.chartAPI.generateChart();
    document.getElementById("img-graph-div").innerHTML = html;
    const selectValidatePlateThickness = await window.electronAPI.getConfig("selectValidatePlateThickness")
    setChartLabel(selectValidatePlateThickness)

  }

})

displayModelChange.addEventListener("click", async () => {
  await window.electronAPI.factoryConfiguration()
});

video1HTML.addEventListener("durationchange", function(){
  document.getElementById("VIDEO-TIME-MODEL1").innerHTML = convertTime(this.duration)
});
video1HTML.addEventListener("timeupdate", function(){
  document.getElementById("VIDEO-TIME-MODEL1").innerHTML = convertTime(this.currentTime) + "/" + convertTime(this.duration)
});

video1HTML.addEventListener("canplay", function(){
  console.log("video1:canplay")
});
video2HTML.addEventListener("durationchange", function(){
  document.getElementById("VIDEO-TIME-MODEL2").innerHTML = convertTime(this.duration)
});
video2HTML.addEventListener("timeupdate", function(){
  document.getElementById("VIDEO-TIME-MODEL2").innerHTML = convertTime(this.currentTime) + "/" + convertTime(this.duration)
});

video2HTML.addEventListener("canplay", function(){
  console.log("video2:canplay")
});
video1HTML.addEventListener("ended", async () => {
  video1HTML.currentTime = 0
  if(video2HTML.currentTime == 0) {
    video2HTML.currentTime = 0
    document.getElementById("forward-label").innerHTML = "&#215;1 speed"
    await window.electronAPI.setVideoSpeed("1.0")
    document.getElementById("play-btn").innerHTML = svgPlay
    await window.electronAPI.isVideoPlay(false)  
  }
});
video2HTML.addEventListener("ended", async () => {
  video2HTML.currentTime = 0
  if(video1HTML.currentTime == 0) {
    video1HTML.currentTime = 0
    document.getElementById("forward-label").innerHTML = "&#215;1 speed"
    await window.electronAPI.setVideoSpeed("1.0")
    document.getElementById("play-btn").innerHTML = svgPlay
    await window.electronAPI.isVideoPlay(false)  
  }
});

forwardToggleBtn.addEventListener("click", async () => {
  const videoSpeed = await window.electronAPI.getConfig("videoSpeed")
  if (videoSpeed == "1.0") {

    await window.electronAPI.setVideoSpeed("2.0")
    document.getElementById("forward-label").innerHTML = "&#215;2 speed"
    video1HTML.playbackRate = 2.0
    video2HTML.playbackRate = 2.0
 
  } else if (videoSpeed == "2.0") {

    await window.electronAPI.setVideoSpeed("4.0")
    document.getElementById("forward-label").innerHTML = "&#215;4 speed"
    video1HTML.playbackRate = 4.0
    video2HTML.playbackRate = 4.0

  } else if (videoSpeed == "4.0") {

    await window.electronAPI.setVideoSpeed("8.0")
    document.getElementById("forward-label").innerHTML = "&#215;8 speed"
    video1HTML.playbackRate = 8.0
    video2HTML.playbackRate = 8.0

  } else if (videoSpeed == "8.0") {

    await window.electronAPI.setVideoSpeed("1.0")
    document.getElementById("forward-label").innerHTML = "&#215;1 speed"
    video1HTML.playbackRate = 1.0
    video2HTML.playbackRate = 1.0

  }

});

playBtn.addEventListener("click",async () => {
  const videoSpeed = await window.electronAPI.getConfig("videoSpeed")
  const isVideoPlay = await window.electronAPI.isVideoPlay()
  if(isVideoPlay) {
    document.getElementById("play-btn").innerHTML = svgPlay
    await window.electronAPI.isVideoPlay(false)
    video1HTML.pause()
    video2HTML.pause()
    
  } else {
    document.getElementById("play-btn").innerHTML = svgPause
    await window.electronAPI.isVideoPlay(true)
    if (videoSpeed == "1.0") {

      video1HTML.playbackRate = 1.0
      video2HTML.playbackRate = 1.0
   
    } else if (videoSpeed == "2.0") {
  
      video1HTML.playbackRate = 2.0
      video2HTML.playbackRate = 2.0
  
    } else if (videoSpeed == "4.0") {
  
      video1HTML.playbackRate = 4.0
      video2HTML.playbackRate = 4.0
  
    } else if (videoSpeed == "8.0") {
  
      video1HTML.playbackRate = 8.0
      video2HTML.playbackRate = 8.0
  
    }
    video1HTML.play()
    video2HTML.play()
    
  }
});

pauseBtn.addEventListener("click",async () => {
  video1HTML.pause()
  video2HTML.pause()
  video1HTML.currentTime = 0
  video2HTML.currentTime = 0

  document.getElementById("forward-label").innerHTML = "&#215;1 speed"
  await window.electronAPI.setVideoSpeed("1.0")
  document.getElementById("play-btn").innerHTML = svgPlay
  await window.electronAPI.isVideoPlay(false)
});

(function () {
  "use strict";
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

const setPartsData = async (plateThicknessValue) => {
  console.log("setPartsData")

  await window.electronAPI.setConfig({key:"selectValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"plateThicknessValidateVideo1", data: null})
  await window.electronAPI.setConfig({key:"plateThicknessValidateVideo2", data: null})
  await window.electronAPI.setConfig({key:"selectPartsValue", data:null})

  const model1ValidateParts = await window.electronAPI.getConfig("model1ValidateParts")
  const model2ValidateParts = await window.electronAPI.getConfig("model2ValidateParts")

  let result1 = []
  console.log("plateThicknessValue:" + plateThicknessValue)
  if (model1ValidateParts != null || model1ValidateParts != undefined) {

    Object.keys(model1ValidateParts).filter( (key) => { 
      console.dir(model1ValidateParts[key])
      const rtn = Object.keys(model1ValidateParts[key]).filter( (plateThicknessKey) => {
        console.log([plateThicknessKey] == plateThicknessValue)
        return ([plateThicknessKey] == plateThicknessValue)
      })
      console.log("typeof rtn:" + typeof rtn)
      if (rtn != null && rtn != undefined && rtn != "") {
        result1.push(key)
      }
    });
  }
  
  console.log("result1:" + JSON.stringify(result1));

  let result2 = []
  if (model2ValidateParts != null || model2ValidateParts != undefined) {
    Object.keys(model2ValidateParts).filter( (key) => { 
      console.dir(model2ValidateParts[key])
      const rtn = Object.keys(model2ValidateParts[key]).filter( (plateThicknessKey) => {
        console.log([plateThicknessKey] == plateThicknessValue)
        return ([plateThicknessKey] == plateThicknessValue)
      })
      console.log("typeof rtn:" + typeof rtn)
      if (rtn != null && rtn != undefined && rtn != "") {
        result2.push(key)      
      }
    });  
  }
  
  console.log("result2:" + JSON.stringify(result2));
  const result = result1.concat(result2)
  let selectPartsValue = []
  console.log("result1.length:" +result1.length)
  console.log("result2.length:" +result2.length)
  if (result1.length >= 1 && result2.length >= 1) {
    selectPartsValue = getDuplicateValues(result).concat()
  } else if (result1.length >= 1 && result2.length <= 0) {
    selectPartsValue = result1
  } else if (result1.length <= 0 && result2.length >= 1) {
    selectPartsValue = result2
  }
  console.log("selectPartsValue:" + JSON.stringify(selectPartsValue))

  let parts = await window.electronAPI.getConfig("parts");
  console.log("setPartsData:parts:" + parts)

  if ( parts == "" && selectPartsValue.length == 1) {
    console.log("selectPartsValue[0]:" + selectPartsValue[0])
    parts = selectPartsValue[0]
    await window.electronAPI.setParts(parts)
    await window.electronAPI.setConfig({key:"selectPartsValue", data:selectPartsValue})
  } else {
    console.log("selectPartsValue:" + JSON.stringify(selectPartsValue))
    await window.electronAPI.setConfig({key:"selectPartsValue", data:selectPartsValue})
  }

  const plateThickness = {
    namespace: "platethickness",
    key: "SELECT-PLATETHICKNESS",
  };
  const partsKey = {
    namespace: "parts",
    key: "PARTS-DATA"
  }
  const partsData = await window.langAPI._t(partsKey)

  console.log(" parts == \"\" && selectPartsValue.length > 1:" +  (parts == "" && selectPartsValue.length > 1))
  if ( parts == "" && selectPartsValue.length > 1) {
    await window.parts.open("parts")
  } else {

    let model1PartsValidatePlateThickness = null
    let model2PartsValidatePlateThickness = null
    const partsImg = document.getElementById("partsImg")
    const partsSize = document.getElementById("img-thumbnail-size")
    console.log("partsData:"+ JSON.stringify(partsData))
    if (parts == "1") {
      partsImg.src = "../images/laser/sample1_ex.png"
      partsSize.innerHTML = partsData["1"].size
      model1PartsValidatePlateThickness = await window.electronAPI.getConfig("model1Parts1ValidatePlateThickness")
      model2PartsValidatePlateThickness = await window.electronAPI.getConfig("model2Parts1ValidatePlateThickness")
    } else if (parts == "2") {
      partsImg.src = "../images/laser/sample2_ex.png"
      partsSize.innerHTML = partsData["2"].size
      model1PartsValidatePlateThickness = await window.electronAPI.getConfig("model1Parts2ValidatePlateThickness")
      model2PartsValidatePlateThickness = await window.electronAPI.getConfig("model2Parts2ValidatePlateThickness")
    } else if (parts == "3") {
      partsImg.src = "../images/laser/sample3_ex.png"
      partsSize.innerHTML = partsData["3"].size
      model1PartsValidatePlateThickness = await window.electronAPI.getConfig("model1Parts3ValidatePlateThickness")
      model2PartsValidatePlateThickness = await window.electronAPI.getConfig("model2Parts3ValidatePlateThickness")
    } else if (parts == "4") {
      partsImg.src = "../images/laser/sample4_ex.png"
      partsSize.innerHTML = partsData["4"].size
      model1PartsValidatePlateThickness = await window.electronAPI.getConfig("model1Parts4ValidatePlateThickness")
      model2PartsValidatePlateThickness = await window.electronAPI.getConfig("model2Parts4ValidatePlateThickness")
    }

    let ary = []
    let video1 = {}
    let video2 = {}
    for (const key in model1PartsValidatePlateThickness){
      ary.push(key)
      video1[key] = model1PartsValidatePlateThickness[key].video
      console.log("for:video1:"+ JSON.stringify(video1))
    }
    for (const key in model2PartsValidatePlateThickness){
      ary.push(key)
      video2[key] = model2PartsValidatePlateThickness[key].video
      console.log("for:video2:"+ JSON.stringify(video2))
    }

    console.log("ary:"+ JSON.stringify(ary))
    const selectValidatePlateThickness = getDuplicateValues(ary).concat()
    const options = document.getElementById(plateThickness.key).options
    console.log("selectValidatePlateThickness:"+ JSON.stringify(selectValidatePlateThickness))
    Array.from(options).forEach(function(option){
      console.log("option.value:"+ option.value)

      if (!selectValidatePlateThickness.includes(option.value)){
        option.disabled = true
      } else {
        option.disabled = false
      }
    })

    console.log("video1:"+ JSON.stringify(video1))
    console.log("video2:"+ JSON.stringify(video2))

    await window.electronAPI.setConfig({key:"selectValidatePlateThickness", data:selectValidatePlateThickness})
    await window.electronAPI.setConfig({key:"plateThicknessValidateVideo1", data:video1})
    await window.electronAPI.setConfig({key:"plateThicknessValidateVideo2", data:video2})

    getVideoData(plateThicknessValue)
  }
};

const setChartLabel = async (selectValidatePlateThickness) => {

  const plateThickness = {
    namespace: "platethickness",
    key: "SELECT-PLATETHICKNESS",
  };
  const chartHTML = document.getElementById("img-graph-div")
  const chartLabel = chartHTML.getElementsByClassName("ct-label ct-horizontal")

  console.dir(chartLabel)

  console.log("selectValidatePlateThickness:"+selectValidatePlateThickness)
  // if (selectValidatePlateThickness == undefined) {
    const model1ValidateParts = await window.electronAPI.getConfig("model1ValidateParts")
    const model2ValidateParts = await window.electronAPI.getConfig("model2ValidateParts")

    console.log("laser:model1ValidateParts:" + JSON.stringify(model1ValidateParts))
    console.log("laser:model2ValidateParts:" + JSON.stringify(model2ValidateParts))

    let model1Parts1ValidatePlateThickness = null
    let model1Parts2ValidatePlateThickness = null
    let model1Parts3ValidatePlateThickness = null
    let model1Parts4ValidatePlateThickness = null
    let model2Parts1ValidatePlateThickness = null
    let model2Parts2ValidatePlateThickness = null
    let model2Parts3ValidatePlateThickness = null
    let model2Parts4ValidatePlateThickness = null
    let ary = []
    let ary1 = []
    let ary2 = []
    let video1 = {}
    let video2 = {}
  
    for (const key in model1ValidateParts) {
      console.log("Object.assign({},model1ValidateParts[key]):" + JSON.stringify(Object.assign({},model1ValidateParts[key])))
      console.log("model1ValidateParts[key]:" + JSON.stringify(model1ValidateParts[key]))
      if (key == "1") {
        window.electronAPI.setConfig({key:"model1Parts1ValidatePlateThickness",data:Object.assign({},model1ValidateParts[key])})
        model1Parts1ValidatePlateThickness = Object.assign({},model1ValidateParts[key])
        for (const plateThicknessKey in model1Parts1ValidatePlateThickness){
          ary1.push(plateThicknessKey)
          video1[plateThicknessKey] = model1Parts1ValidatePlateThickness[plateThicknessKey].video
          console.log("for:video1:"+ JSON.stringify(video1))
        }
      } else if (key == "2") {
        window.electronAPI.setConfig({key:"model1Parts2ValidatePlateThickness",data:Object.assign({},model1ValidateParts[key])})
        model1Parts2ValidatePlateThickness = Object.assign({},model1ValidateParts[key])
        for (const plateThicknessKey in model1Parts2ValidatePlateThickness){
          ary1.push(plateThicknessKey)
          video1[plateThicknessKey] = model1Parts2ValidatePlateThickness[plateThicknessKey].video
          console.log("for:video1:"+ JSON.stringify(video1))
        }
      } else if (key == "3") {
        window.electronAPI.setConfig({key:"model1Parts3ValidatePlateThickness",data:Object.assign({},model1ValidateParts[key])})
        model1Parts3ValidatePlateThickness = Object.assign({},model1ValidateParts[key])
        for (const plateThicknessKey in model1Parts3ValidatePlateThickness){
          ary1.push(plateThicknessKey)
          video1[plateThicknessKey] = model1Parts3ValidatePlateThickness[plateThicknessKey].video
          console.log("for:video1:"+ JSON.stringify(video1))
        }
      } else if (key == "4") {
        window.electronAPI.setConfig({key:"model1Parts4ValidatePlateThickness",data:Object.assign({},model1ValidateParts[key])})
        model1Parts4ValidatePlateThickness = Object.assign({},model1ValidateParts[key])
        for (const plateThicknessKey in model1Parts4ValidatePlateThickness){
          ary1.push(plateThicknessKey)
          video1[plateThicknessKey] = model1Parts4ValidatePlateThickness[plateThicknessKey].video
          console.log("for:video1:"+ JSON.stringify(video1))
        }
      }
    }
  
    for (const key in model2ValidateParts) {
      console.log("Object.assign({},model2ValidateParts[key]):" + JSON.stringify(Object.assign({},model2ValidateParts[key])))
      console.log("model2ValidateParts[key]:" + JSON.stringify(model2ValidateParts[key]))
      if (key == "1") {
        window.electronAPI.setConfig({key:"model2Parts1ValidatePlateThickness",data:Object.assign({},model2ValidateParts[key])})
        model2Parts1ValidatePlateThickness = Object.assign({},model2ValidateParts[key])
        for (const plateThicknessKey in model2Parts1ValidatePlateThickness){
          ary2.push(plateThicknessKey)
          video2[plateThicknessKey] = model2Parts1ValidatePlateThickness[plateThicknessKey].video
          console.log("for:video2:"+ JSON.stringify(video2))
        }
      } else if (key == "2") {
        window.electronAPI.setConfig({key:"model2Parts2ValidatePlateThickness",data:Object.assign({},model2ValidateParts[key])})
        model2Parts2ValidatePlateThickness = Object.assign({},model2ValidateParts[key])
        for (const plateThicknessKey in model2Parts2ValidatePlateThickness){
          ary2.push(plateThicknessKey)
          video2[plateThicknessKey] = model2Parts2ValidatePlateThickness[plateThicknessKey].video
          console.log("for:video2:"+ JSON.stringify(video2))
        }
      } else if (key == "3") {
        window.electronAPI.setConfig({key:"model2Parts3ValidatePlateThickness",data:Object.assign({},model2ValidateParts[key])})
        model2Parts3ValidatePlateThickness = Object.assign({},model2ValidateParts[key])
        for (const plateThicknessKey in model2Parts3ValidatePlateThickness){
          ary2.push(plateThicknessKey)
          video2[plateThicknessKey] = model2Parts3ValidatePlateThickness[plateThicknessKey].video
          console.log("for:video2:"+ JSON.stringify(video2))
        }
      } else if (key == "4") {
        window.electronAPI.setConfig({key:"model2Parts4ValidatePlateThickness",data:Object.assign({},model2ValidateParts[key])})
        model2Parts4ValidatePlateThickness = Object.assign({},model2ValidateParts[key])
        for (const plateThicknessKey in model2Parts4ValidatePlateThickness){
          ary2.push(plateThicknessKey)
          video2[plateThicknessKey] = model2Parts4ValidatePlateThickness[plateThicknessKey].video
          console.log("for:video2:"+ JSON.stringify(video2))
        }
      }
    }

    if (ary1.length > 0 && ary2.length > 0) {
      ary = ary1.concat(ary2)
      ary = getDuplicateValues(ary).concat()
    } else if (ary1.length > 0 && ary2.length <= 0) {
        ary = ary1.concat()
    } else if (ary1.length <= 0 && ary2.length > 0) {
        ary = ary2.concat()
    }

    console.log("ary:"+ JSON.stringify(ary))
    selectValidatePlateThickness = ary.concat()

  // }

  Array.from(chartLabel).forEach(function(element){
    if (selectValidatePlateThickness.includes(element.textContent.slice(1))){
      element.classList.add("btn", "btn-primary")
      
      element.addEventListener("click", async () => {
        await window.electronAPI.setParts("")
        const plateThicknessValue = element.textContent.slice(1)
        await window.electronAPI.setPlateThickness(plateThicknessValue)
        const options = document.getElementById(plateThickness.key).options
        Array.from(options).forEach(function(option){
          if (option.value == plateThicknessValue){
            option.selected = true
            document.getElementById(plateThickness.key).classList.remove("is-invalid")
          }
        })

        setPartsData(plateThicknessValue)

      })
      console.dir(element)
    }
  })

};

const getVideoData = async (plateThicknessValue) =>{
  document.getElementById("forward-label").innerHTML = "&#215;1 speed"
  await window.electronAPI.setVideoSpeed("1.0")
  document.getElementById("play-btn").innerHTML = svgPlay
  await window.electronAPI.isVideoPlay(false)

  const plateThicknessValidateVideo1 = await window.electronAPI.getConfig("plateThicknessValidateVideo1")
  const plateThicknessValidateVideo2 = await window.electronAPI.getConfig("plateThicknessValidateVideo2")

  console.log("laser:plateThicknessValidateVideo1:" + JSON.stringify(plateThicknessValidateVideo1))
  console.log("laser:plateThicknessValidateVideo2:" + JSON.stringify(plateThicknessValidateVideo2))

  document.getElementById("VIDEO-TIME-MODEL1").innerHTML = "00:00"
  document.getElementById("VIDEO-TIME-MODEL2").innerHTML = "00:00"
  const video1 = plateThicknessValidateVideo1[plateThicknessValue]
  if (video1 != null) {
    console.log("await window.electronAPI.resourcesPathJoin(video1):" + await window.electronAPI.resourcesPathJoin(video1))
    console.log("video1:"+video1)
    video1HTML.src = video1
    video1HTML.type ="video/mp4"
    console.dir(video1HTML)
    video1HTML.load()
  }
  const video2 = plateThicknessValidateVideo2[plateThicknessValue]
  if (video2 != null) {
    console.log("video2:"+video2)
    video2HTML.src = video2
    video2HTML.type ="video/mp4"
    console.dir(video2HTML)
    video2HTML.load()
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded");

  const isDarkMode = await window.darkMode.isDarkMode();

  console.log("isDarMode:" + isDarkMode);

  if (isDarkMode) {
    document.getElementById("navbar").classList.add("navbar-dark");
    document.getElementById("navbar").classList.add("bg-dark");
    // document.getElementById("navmenu").classList.add("dropdown-menu-dark");
  } else {
    document.getElementById("navbar").classList.remove("navbar-dark");
    document.getElementById("navbar").classList.remove("bg-dark");
    // document.getElementById("navmenu").classList.remove("dropdown-menu-dark");
  }

  const locale = await window.electronAPI.getConfig("locale")
  document.getElementById("partsImg").src = "../images/please-select-a-product-" + locale + ".png"

  const data = {
    namespace: "laser",
    key: "TITLE",
  };
  const title = await window.langAPI._t(data);
  window.electronAPI.setTitle(title);
  document.getElementById(data.key).textContent = title;

  // data.key = "LASER";
  // document.getElementById("laserAnchor").textContent = await window.langAPI._t(data);
  // data.key = "MFM";
  // document.getElementById("mfmAnchor").textContent = await window.langAPI._t(data);

  data.key = "LABEL-MATERIAL1";
  document.getElementById(data.key).textContent = await window.langAPI._t(data);
  data.key = "LABEL-ASSISTGAS1";
  document.getElementById(data.key).textContent = await window.langAPI._t(data);
  data.key = "LABEL-MATERIAL2";
  document.getElementById(data.key).textContent = await window.langAPI._t(data);
  data.key = "LABEL-ASSISTGAS2";
  document.getElementById(data.key).textContent = await window.langAPI._t(data);
  data.key = "LABEL-MODEL1";
  document.getElementById(data.key).textContent = await window.langAPI._t(data);
  data.key = "LABEL-MODEL2";
  document.getElementById(data.key).textContent = await window.langAPI._t(data);
  data.key = "LABEL-OSCILLATOR1";
  document.getElementById(data.key).textContent = await window.langAPI._t(data);
  data.key = "LABEL-OSCILLATOR2";
  document.getElementById(data.key).textContent = await window.langAPI._t(data);
  data.key = "LABEL-PLATETHICKNESS";
  document.getElementById(data.key).textContent = await window.langAPI._t(data);
  data.key = "VIDEO-LABEL-MODEL1";
  document.getElementById(data.key).textContent = await window.langAPI._t(data);
  data.key = "VIDEO-LABEL-MODEL2";
  document.getElementById(data.key).textContent = await window.langAPI._t(data);
  data.key = "LABEL-MACHININGTIME";
  document.getElementById("VIDEO-TIMELABEL-MODEL1").textContent = await window.langAPI._t(data);
  document.getElementById("VIDEO-TIMELABEL-MODEL2").textContent = await window.langAPI._t(data);
  document.getElementById("forward-label").innerHTML = "&#215;1 speed"
  await window.electronAPI.setVideoSpeed("1.0")
  document.getElementById("play-btn").innerHTML = svgPlay
  await window.electronAPI.isVideoPlay(false)

  data.key = "PLEASE-SELECT";
  const defaultoption = document.createElement("option");
  defaultoption.value = "";
  defaultoption.innerHTML = await window.langAPI._t(data);
  // defaultoption.disabled = true;
  defaultoption.selected = true;

  const material = {
    namespace: "material",
    key: "SELECT-MATERIAL",
  };

  const selectMaterial1 = document.getElementById(material.key + "1");
  selectMaterial1.classList.add("is-invalid")
  let options = await window.langAPI._t(material);
  selectMaterial1.appendChild(defaultoption.cloneNode(true));

  window.electronAPI.setMaterial1("")

  for (const key in options) {
    const option = document.createElement("option");
    option.value = key;
    option.innerHTML = options[key];
    if(key == "mildSteel") {
      window.electronAPI.setMaterial1(key)
      option.selected = true
      document.getElementById(material.key + "1").classList.remove("is-invalid")
    }
    selectMaterial1.appendChild(option);
  }

  material.key = "validationMaterial1Feedback";
  document.getElementById(material.key).textContent = await window.langAPI._t(
    material
  );

  material.key = "SELECT-MATERIAL";
  const selectMaterial2 = document.getElementById(material.key + "2");
  selectMaterial2.classList.add("is-invalid")
  options = await window.langAPI._t(material);
  selectMaterial2.appendChild(defaultoption.cloneNode(true));

  window.electronAPI.setMaterial2("")

  for (const key in options) {
    const option = document.createElement("option");
    option.value = key;
    option.innerHTML = options[key];
    if(key == "mildSteel") {
      window.electronAPI.setMaterial2(key)
      option.selected = true
      document.getElementById(material.key + "2").classList.remove("is-invalid")
    }
    selectMaterial2.appendChild(option);
  }

  material.key = "validationMaterial2Feedback";
  document.getElementById(material.key).textContent = await window.langAPI._t(
    material
  );

  const assistGas = {
    namespace: "assist-gas",
    key: "SELECT-ASSISTGAS",
  };

  const selectAssistGas1 = document.getElementById(assistGas.key + "1");
  selectAssistGas1.classList.add("is-invalid")
  options = await window.langAPI._t(assistGas);
  selectAssistGas1.appendChild(defaultoption.cloneNode(true));
  window.electronAPI.setAssistGas1("")

  for (const key in options) {
    const option = document.createElement("option");
    option.value = key;
    option.innerHTML = options[key];
    if(key == "nitrogen") {
      window.electronAPI.setAssistGas1(key)
      option.selected = true
      selectAssistGas1.classList.remove("is-invalid")
    }
    selectAssistGas1.appendChild(option);
  }
  assistGas.key = "validationAssistGas1Feedback";
  document.getElementById(assistGas.key).textContent = await window.langAPI._t(
    assistGas
  );

  assistGas.key = "SELECT-ASSISTGAS";
  const selectAssistGas2 = document.getElementById(assistGas.key + "2");
  selectAssistGas2.classList.add("is-invalid")
  options = await window.langAPI._t(assistGas);
  selectAssistGas2.appendChild(defaultoption.cloneNode(true));
  window.electronAPI.setAssistGas2("")

  for (const key in options) {
    const option = document.createElement("option");
    option.value = key;
    option.innerHTML = options[key];
    if(key == "nitrogen") {
      window.electronAPI.setAssistGas2(key)
      option.selected = true
      selectAssistGas2.classList.remove("is-invalid")
    }
    selectAssistGas2.appendChild(option);
  }
  assistGas.key = "validationAssistGas2Feedback";
  document.getElementById(assistGas.key).textContent = await window.langAPI._t(
    assistGas
  );

  const model = {
    namespace: "lasermodel",
    key: "SELECT-MODEL",
  };

  const selectModel1 = document.getElementById(model.key + "1");
  document.getElementById(model.key + "1").classList.add("is-invalid")
  options = await window.langAPI._t(model);
  selectModel1.appendChild(defaultoption.cloneNode(true));
  window.electronAPI.setModel1("")

  for (const key in options) {
    const option = document.createElement("option");
    option.value = key;
    option.innerHTML = options[key];
    selectModel1.appendChild(option);
  }

  const selectModel2 = document.getElementById(model.key + "2");
  document.getElementById(model.key + "2").classList.add("is-invalid")
  options = await window.langAPI._t(model);
  selectModel2.appendChild(defaultoption.cloneNode(true));
  window.electronAPI.setModel2("")

  for (const key in options) {
    const option = document.createElement("option");
    option.value = key;
    option.innerHTML = options[key];
    selectModel2.appendChild(option);
  }

  model.key = "validationModel1Feedback";
  document.getElementById(model.key).textContent = await window.langAPI._t(
    model
  );
  model.key = "validationModel2Feedback";
  document.getElementById(model.key).textContent = await window.langAPI._t(
    model
  );

  const oscillator = {
    namespace: "oscillator",
    key: "SELECT-OSCILLATOR",
  };

  const selectOscillator1 = document.getElementById(oscillator.key + "1");
  document.getElementById(oscillator.key + "1").classList.add("is-invalid")
  options = await window.langAPI._t(oscillator);
  selectOscillator1.appendChild(defaultoption.cloneNode(true));
  window.electronAPI.setOscillator1("")

  for (const key in options) {
    const option = document.createElement("option");
    option.value = key;
    option.innerHTML = options[key];
    selectOscillator1.appendChild(option);
  }

  const selectOscillator2 = document.getElementById(oscillator.key + "2");
  document.getElementById(oscillator.key + "2").classList.add("is-invalid")
  options = await window.langAPI._t(oscillator);
  selectOscillator2.appendChild(defaultoption.cloneNode(true));
  window.electronAPI.setOscillator2("")

  for (const key in options) {
    const option = document.createElement("option");
    option.value = key;
    option.innerHTML = options[key];
    selectOscillator2.appendChild(option);
  }

  oscillator.key = "validationOscillator1Feedback";
  document.getElementById(oscillator.key).textContent = await window.langAPI._t(
    oscillator
  );
  oscillator.key = "validationOscillator2Feedback";
  document.getElementById(oscillator.key).textContent = await window.langAPI._t(
    oscillator
  );

  const platethickness = {
    namespace: "platethickness",
    key: "SELECT-PLATETHICKNESS",
  };

  const selectPlateThickness = document.getElementById(platethickness.key);
  document.getElementById(platethickness.key).classList.add("is-invalid")

  options = await window.langAPI._t(platethickness);
  selectPlateThickness.appendChild(defaultoption.cloneNode(true));
  window.electronAPI.setPlateThickness("")

  for (const key in options) {
    const option = document.createElement("option");
    option.value = key;
    option.innerHTML = options[key];
    selectPlateThickness.appendChild(option);
  }

  platethickness.key = "validationPlateThicknessFeedback";
  document.getElementById(platethickness.key).textContent =
    await window.langAPI._t(platethickness);

  window.electronAPI.setParts("")
  await window.electronAPI.setConfig({key:"model1Parts1ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2Parts1ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1Parts2ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2Parts2ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1Parts3ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2Parts3ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1Parts4ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2Parts4ValidatePlateThickness", data: null})

});

partsSelect.addEventListener("click", async () => {

  await window.parts.open("parts")

  // const filePath = await window.electronAPI.openFile();
  // filePathElement.innerText = filePath;
});

if (settingsBtn != null) {
  settingsBtn.addEventListener("click", async () => {
    await window.child.open("settings");
  });
}

if (minimizeBtn != null) {
  minimizeBtn.addEventListener("click", async () => {
    await window.electronAPI.minimize();
  });
}

selectMaterial1.addEventListener("change", async (e) => {

  const material = {
    namespace: "material",
    key: "SELECT-MATERIAL1",
  };
  const assistGas = {
    namespace: "assist-gas",
    key: "SELECT-ASSISTGAS1",
  };
  const plateThickness = {
    namespace: "platethickness",
    key: "SELECT-PLATETHICKNESS",
  };

  await window.electronAPI.setConfig({key:"model1Parts1ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1Parts2ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1Parts3ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1Parts4ValidatePlateThickness", data: null})

  await window.electronAPI.setConfig({key:"model1ValidateParts", data: null})
  await window.electronAPI.setConfig({key:"selectValidatePlateThickness", data: null})
  const selectValidatePlateThickness = await window.electronAPI.getConfig("selectValidatePlateThickness")
  if (e.target.value == "") {
    window.electronAPI.setMaterial1("")
    document.getElementById(material.key).classList.add("is-invalid")
  } else {
    let chartDataErr = false
    window.electronAPI.setMaterial1(e.target.value)
    document.getElementById(material.key).classList.remove("is-invalid")

    const validateAssistGas = await window.electronAPI.getConfig("assistGas1ValidateMaterial")
    const validateParts = await window.electronAPI.getConfig("partsValidateMaterial")
    const validatePlateThickness = await window.electronAPI.getConfig("plateThicknessValidateMaterial")
    // const selectValidatePlateThickness = await window.electronAPI.getConfig("selectValidatePlateThickness")

    if (!(Array.isArray(validateAssistGas) ? validateAssistGas.includes(e.target.value) : false)) {
      window.electronAPI.setAssistGas1("")
      document.getElementById(assistGas.key).classList.add("is-invalid")
      document.getElementById(assistGas.key).options[0].selected = true
      chartDataErr = true
    } else {
      document.getElementById(assistGas.key).classList.remove("is-invalid")
    }
    if (!(Array.isArray(validateParts) ? validateParts.includes(e.target.value) : false)) {
      window.electronAPI.setParts("")
      document.getElementById("img-thumbnail-size").innerHTML = ""
      const locale = await window.electronAPI.getConfig("locale")
      document.getElementById("partsImg").src = "../images/please-select-a-product-" + locale + ".png"
    }
    if (!(Array.isArray(validatePlateThickness) ? validatePlateThickness.includes(e.target.value) : false)) {
      window.electronAPI.setPlateThickness("")
      document.getElementById(plateThickness.key).classList.add("is-invalid")
      document.getElementById(plateThickness.key).options[0].selected = true
    } else {
      document.getElementById(plateThickness.key).classList.remove("is-invalid")
    }

    let html = "No Data"
    if (!chartDataErr) {
      html = await window.chartAPI.generateChart();
      document.getElementById("img-graph-div").innerHTML = html;
      setChartLabel(selectValidatePlateThickness)
      const plateThicknessValue = await window.electronAPI.getConfig("platethickness")
      setPartsData(plateThicknessValue)
    } else {
      document.getElementById("img-graph-div").innerHTML = html;
    }

  }

});

selectMaterial2.addEventListener("change", async (e) => {

  const material = {
    namespace: "material",
    key: "SELECT-MATERIAL2",
  };
  const assistGas = {
    namespace: "assist-gas",
    key: "SELECT-ASSISTGAS2",
  };
  const plateThickness = {
    namespace: "platethickness",
    key: "SELECT-PLATETHICKNESS",
  };

  await window.electronAPI.setConfig({key:"model2Parts1ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2Parts2ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2Parts3ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2Parts4ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2ValidateParts", data: null})
  await window.electronAPI.setConfig({key:"selectValidatePlateThickness", data: null})
  const selectValidatePlateThickness = await window.electronAPI.getConfig("selectValidatePlateThickness")

  if (e.target.value == "") {
    window.electronAPI.setMaterial2("")
    document.getElementById(material.key).classList.add("is-invalid")
  } else {
    let chartDataErr = false
    window.electronAPI.setMaterial2(e.target.value)
    document.getElementById(material.key).classList.remove("is-invalid")

    const validateAssistGas = await window.electronAPI.getConfig("assistGas2ValidateMaterial")
    const validateParts = await window.electronAPI.getConfig("partsValidateMaterial")
    const validatePlateThickness = await window.electronAPI.getConfig("plateThicknessValidateMaterial")
    // const selectValidatePlateThickness = await window.electronAPI.getConfig("selectValidatePlateThickness")

    if (!(Array.isArray(validateAssistGas) ? validateAssistGas.includes(e.target.value) : false)) {
      window.electronAPI.setAssistGas1("")
      document.getElementById(assistGas.key).classList.add("is-invalid")
      document.getElementById(assistGas.key).options[0].selected = true
      chartDataErr = true
    } else {
      document.getElementById(assistGas.key).classList.remove("is-invalid")
    }
    if (!(Array.isArray(validateParts) ? validateParts.includes(e.target.value) : false)) {
      window.electronAPI.setParts("")
      document.getElementById("img-thumbnail-size").innerHTML = ""
      const locale = await window.electronAPI.getConfig("locale")
      document.getElementById("partsImg").src = "../images/please-select-a-product-" + locale + ".png"
    }
    if (!(Array.isArray(validatePlateThickness) ? validatePlateThickness.includes(e.target.value) : false)) {
      window.electronAPI.setPlateThickness("")
      document.getElementById(plateThickness.key).classList.add("is-invalid")
      document.getElementById(plateThickness.key).options[0].selected = true
    } else {
      document.getElementById(plateThickness.key).classList.remove("is-invalid")
    }

    let html = "No Data"
    if (!chartDataErr) {
      html = await window.chartAPI.generateChart();
      document.getElementById("img-graph-div").innerHTML = html;
      setChartLabel(selectValidatePlateThickness)
      const plateThicknessValue = await window.electronAPI.getConfig("platethickness")
      setPartsData(plateThicknessValue)
    } else {
      document.getElementById("img-graph-div").innerHTML = html;
    }

  }

});

selectAssistGas1.addEventListener("change", async (e) => {

  const material = {
    namespace: "material",
    key: "SELECT-MATERIAL1",
  };
  const assistGas = {
    namespace: "assist-gas",
    key: "SELECT-ASSISTGAS1",
  };
  const plateThickness = {
    namespace: "platethickness",
    key: "SELECT-PLATETHICKNESS",
  };

  await window.electronAPI.setConfig({key:"model1Parts1ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1Parts2ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1Parts3ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1Parts4ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1ValidateParts", data: null})
  await window.electronAPI.setConfig({key:"selectValidatePlateThickness", data: null})
  const selectValidatePlateThickness = await window.electronAPI.getConfig("selectValidatePlateThickness")

  if (e.target.value == "") {
    window.electronAPI.setAssistGas1("")
    document.getElementById(assistGas.key).classList.add("is-invalid")
  } else {
    let chartDataErr = false
    window.electronAPI.setAssistGas1(e.target.value)
    document.getElementById(assistGas.key).classList.remove("is-invalid")

    const validateMaterial = await window.electronAPI.getConfig("material1ValidateAssistGas")
    const validateParts = await window.electronAPI.getConfig("partsValidateAssistGas")
    const validatePlateThickness = await window.electronAPI.getConfig("plateThicknessValidateAssistGas")
    // const selectValidatePlateThickness = await window.electronAPI.getConfig("selectValidatePlateThickness")

    if (!(Array.isArray(validateMaterial) ? validateMaterial.includes(e.target.value) : false)) {
      window.electronAPI.setMaterial1("")
      document.getElementById(material.key).classList.add("is-invalid")
      document.getElementById(material.key).options[0].selected = true
      chartDataErr = true
    } else {
      document.getElementById(material.key).classList.remove("is-invalid")
    }
    if (!(Array.isArray(validateParts) ? validateParts.includes(e.target.value) : false)) {
      window.electronAPI.setParts("")
      document.getElementById("img-thumbnail-size").innerHTML = ""
      const locale = await window.electronAPI.getConfig("locale")
      document.getElementById("partsImg").src = "../images/please-select-a-product-" + locale + ".png"
    }
    if (!(Array.isArray(validatePlateThickness) ? validatePlateThickness.includes(e.target.value) : false)) {
      window.electronAPI.setPlateThickness("")
      document.getElementById(plateThickness.key).classList.add("is-invalid")
      document.getElementById(plateThickness.key).options[0].selected = true
    } else {
      document.getElementById(plateThickness.key).classList.remove("is-invalid")
    }

    let html = "No Data"
    if (!chartDataErr) {
      html = await window.chartAPI.generateChart();
      document.getElementById("img-graph-div").innerHTML = html;
      setChartLabel(selectValidatePlateThickness)
      const plateThicknessValue = await window.electronAPI.getConfig("platethickness")
      setPartsData(plateThicknessValue)
    } else {
      document.getElementById("img-graph-div").innerHTML = html;
    }

  }

});

selectAssistGas2.addEventListener("change", async (e) => {

  const material = {
    namespace: "material",
    key: "SELECT-MATERIAL2",
  };
  const assistGas = {
    namespace: "assist-gas",
    key: "SELECT-ASSISTGAS2",
  };
  const plateThickness = {
    namespace: "platethickness",
    key: "SELECT-PLATETHICKNESS",
  };

  await window.electronAPI.setConfig({key:"model2Parts1ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2Parts2ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2Parts3ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2Parts4ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2ValidateParts", data: null})
  await window.electronAPI.setConfig({key:"selectValidatePlateThickness", data: null})
  const selectValidatePlateThickness = await window.electronAPI.getConfig("selectValidatePlateThickness")

  if (e.target.value == "") {
    window.electronAPI.setAssistGas2("")
    document.getElementById(assistGas.key).classList.add("is-invalid")
  } else {
    let chartDataErr = false
    window.electronAPI.setAssistGas2(e.target.value)
    document.getElementById(assistGas.key).classList.remove("is-invalid")

    const validateMaterial = await window.electronAPI.getConfig("material2ValidateAssistGas")
    const validateParts = await window.electronAPI.getConfig("partsValidateAssistGas")
    const validatePlateThickness = await window.electronAPI.getConfig("plateThicknessValidateAssistGas")
    // const selectValidatePlateThickness = await window.electronAPI.getConfig("selectValidatePlateThickness")

    if (!(Array.isArray(validateMaterial) ? validateMaterial.includes(e.target.value) : false)) {
      window.electronAPI.setMaterial2("")
      document.getElementById(material.key).classList.add("is-invalid")
      document.getElementById(material.key).options[0].selected = true
      chartDataErr = true
    } else {
      document.getElementById(material.key).classList.remove("is-invalid")
    }
    if (!(Array.isArray(validateParts) ? validateParts.includes(e.target.value) : false)) {
      window.electronAPI.setParts("")
      document.getElementById("img-thumbnail-size").innerHTML = ""
      const locale = await window.electronAPI.getConfig("locale")
      document.getElementById("partsImg").src = "../images/please-select-a-product-" + locale + ".png"
    }
    if (!(Array.isArray(validatePlateThickness) ? validatePlateThickness.includes(e.target.value) : false)) {
      window.electronAPI.setPlateThickness("")
      document.getElementById(plateThickness.key).classList.add("is-invalid")
      document.getElementById(plateThickness.key).options[0].selected = true
    } else {
      document.getElementById(plateThickness.key).classList.remove("is-invalid")
    }

    let html = "No Data"
    if (!chartDataErr) {
      html = await window.chartAPI.generateChart();
      document.getElementById("img-graph-div").innerHTML = html;
      setChartLabel(selectValidatePlateThickness)
      const plateThicknessValue = await window.electronAPI.getConfig("platethickness")
      setPartsData(plateThicknessValue)
    } else {
      document.getElementById("img-graph-div").innerHTML = html;
    }

  }

});

selectModel1.addEventListener("change", async (e) => {
  console.log(e);

  const laser = {
    namespace: "laser",
    key: "VIDEO-LABEL-MODEL1"
  }
  const model1 = {
    namespace: "model",
    key: "SELECT-MODEL1",
  };
  const oscillator1 = {
    namespace: "oscillator",
    key: "SELECT-OSCILLATOR1",
  };

  await window.electronAPI.setConfig({key:"model1Parts1ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1Parts2ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1Parts3ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1Parts4ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1ValidateParts", data: null})
  await window.electronAPI.setConfig({key:"selectValidatePlateThickness", data: null})
  const selectValidatePlateThickness = await window.electronAPI.getConfig("selectValidatePlateThickness")

  console.log("e.target.value:" + e.target.value)
  if (e.target.value == "") {
    window.electronAPI.setModel1("")
    document.getElementById(laser.key).innerHTML = await window.langAPI._t(laser)
    document.getElementById(model1.key).classList.add("is-invalid")
  } else {
    let chartDataErr = false
    await window.electronAPI.setModel1(e.target.value)
    console.log("e.target.value:" + e.target.value)
    document.getElementById(model1.key).classList.remove("is-invalid")

    const validateOscillator1 = await window.electronAPI.getConfig("oscillator1ValidateModel1")
    console.log("validateOscillator1:" + validateOscillator1)
    // const selectValidatePlateThickness = await window.electronAPI.getConfig("selectValidatePlateThickness")

    if (!(Array.isArray(validateOscillator1) ? validateOscillator1.includes(e.target.value) : false)) {
      window.electronAPI.setOscillator1("")
      document.getElementById(oscillator1.key).classList.add("is-invalid")
      document.getElementById(oscillator1.key).options[0].selected = true
      chartDataErr = true
    } else {
      document.getElementById(oscillator1.key).classList.remove("is-invalid")
    }

    const oscillatorData = await window.electronAPI.getConfig("oscillator1")
    document.getElementById(laser.key).innerHTML = e.target.value + "(" + oscillatorData + "kW)"

    let html = "No Data"
    if (!chartDataErr) {
      html = await window.chartAPI.generateChart();
      document.getElementById("img-graph-div").innerHTML = html;
      setChartLabel(selectValidatePlateThickness)
      const plateThicknessValue = await window.electronAPI.getConfig("platethickness")
      setPartsData(plateThicknessValue)
    } else {
      document.getElementById("img-graph-div").innerHTML = html;
    }

  }

});

selectModel2.addEventListener("change", async (e) => {
  console.log(e);

  const laser = {
    namespace: "laser",
    key: "VIDEO-LABEL-MODEL2"
  }
  const model2 = {
    namespace: "model",
    key: "SELECT-MODEL2",
  };
  const oscillator2 = {
    namespace: "oscillator",
    key: "SELECT-OSCILLATOR2",
  };

  await window.electronAPI.setConfig({key:"model2Parts1ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2Parts2ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2Parts3ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2Parts4ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2ValidateParts", data: null})
  await window.electronAPI.setConfig({key:"selectValidatePlateThickness", data: null})
  const selectValidatePlateThickness = await window.electronAPI.getConfig("selectValidatePlateThickness")

  if (e.target.value == "") {
    window.electronAPI.setModel2("")
    document.getElementById(laser.key).innerHTML = await window.langAPI._t(laser)
    document.getElementById(model2.key).classList.add("is-invalid")
  } else {
    let chartDataErr = false
    window.electronAPI.setModel2(e.target.value)
    console.log("e.target.text:" + e.target.text)

    document.getElementById(model2.key).classList.remove("is-invalid")

    const validateOscillator2 = await window.electronAPI.getConfig("oscillator2ValidateModel2")
    // const selectValidatePlateThickness = await window.electronAPI.getConfig("selectValidatePlateThickness")

    if (!(Array.isArray(validateOscillator2) ? validateOscillator2.includes(e.target.value) : false)) {
      window.electronAPI.setOscillator2("")
      document.getElementById(oscillator2.key).classList.add("is-invalid")
      document.getElementById(oscillator2.key).options[0].selected = true
      chartDataErr = true
    } else {
      document.getElementById(oscillator2.key).classList.remove("is-invalid")
    }

    const oscillatorData = await window.electronAPI.getConfig("oscillator2")
    document.getElementById(laser.key).innerHTML = e.target.value + "(" + oscillatorData + "kW)"

    let html = "No Data"
    if (!chartDataErr) {
      html = await window.chartAPI.generateChart();
      document.getElementById("img-graph-div").innerHTML = html;
      setChartLabel(selectValidatePlateThickness)
      const plateThicknessValue = await window.electronAPI.getConfig("platethickness")
      setPartsData(plateThicknessValue)
    } else {
      document.getElementById("img-graph-div").innerHTML = html;
    }
  
  }

});

selectOscillator1.addEventListener("change", async (e) => {
  console.log(e);

  const laser = {
    namespace: "laser",
    key: "VIDEO-LABEL-MODEL1"
  }
  const model1 = {
    namespace: "model",
    key: "SELECT-MODEL1",
  };
  const oscillator1 = {
    namespace: "oscillator",
    key: "SELECT-OSCILLATOR1",
  };

  await window.electronAPI.setConfig({key:"model1Parts1ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1Parts2ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1Parts3ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1Parts4ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1ValidateParts", data: null})
  await window.electronAPI.setConfig({key:"selectValidatePlateThickness", data: null})
  const selectValidatePlateThickness = await window.electronAPI.getConfig("selectValidatePlateThickness")

  if (e.target.value == "") {
    window.electronAPI.setOscillator1("")
    document.getElementById(oscillator1.key).classList.add("is-invalid")
  } else {
    let chartDataErr = false
    window.electronAPI.setOscillator1(e.target.value)
    document.getElementById(oscillator1.key).classList.remove("is-invalid")

    const validateModel1 = await window.electronAPI.getConfig("model1ValidateOscillator1")
    // const selectValidatePlateThickness = await window.electronAPI.getConfig("selectValidatePlateThickness")

    if (!(Array.isArray(validateModel1) ? validateModel1.includes(e.target.value) : false)) {
      window.electronAPI.setModel1("")
      document.getElementById(model1.key).classList.add("is-invalid")
      document.getElementById(model1.key).options[0].selected = true
      document.getElementById(laser.key).innerHTML = await window.langAPI._t(laser)
      chartDataErr = true
    } else {
      const modelData = await window.electronAPI.getConfig("model1")
      document.getElementById(laser.key).innerHTML = modelData + "(" + e.target.value + "kW)"
    }

    let html = "No Data"
    if (!chartDataErr) {
      html = await window.chartAPI.generateChart();
      document.getElementById("img-graph-div").innerHTML = html;
      setChartLabel(selectValidatePlateThickness)
      const plateThicknessValue = await window.electronAPI.getConfig("platethickness")
      setPartsData(plateThicknessValue)
    } else {
      document.getElementById("img-graph-div").innerHTML = html;
    }
  
  }

});

selectOscillator2.addEventListener("change", async (e) => {
  console.log(e);

  const laser = {
    namespace: "laser",
    key: "VIDEO-LABEL-MODEL2"
  }
  const model2 = {
    namespace: "model",
    key: "SELECT-MODEL2",
  };
  const oscillator2 = {
    namespace: "oscillator",
    key: "SELECT-OSCILLATOR2",
  };

  await window.electronAPI.setConfig({key:"model2Parts1ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2Parts2ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2Parts3ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2Parts4ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2ValidateParts", data: null})
  await window.electronAPI.setConfig({key:"selectValidatePlateThickness", data: null})
  const selectValidatePlateThickness = await window.electronAPI.getConfig("selectValidatePlateThickness")

  if (e.target.value == "") {
    window.electronAPI.setOscillator2("")
    document.getElementById(oscillator2.key).classList.add("is-invalid")
  } else {
    let chartDataErr = false
    window.electronAPI.setOscillator2(e.target.value)
    document.getElementById(oscillator2.key).classList.remove("is-invalid")

    const validateModel2 = await window.electronAPI.getConfig("model2ValidateOscillator2")

    if (!(Array.isArray(validateModel2) ? validateModel2.includes(e.target.value) : false)) {
      window.electronAPI.setModel2("")
      document.getElementById(model2.key).classList.add("is-invalid")
      document.getElementById(model2.key).options[0].selected = true
      document.getElementById(laser.key).innerHTML = await window.langAPI._t(laser)
      chartDataErr = true
    } else {
      const modelData = await window.electronAPI.getConfig("model2")
      document.getElementById(laser.key).innerHTML = modelData + "(" + e.target.value + "kW)"
    }

    let html = "No Data"
    if (!chartDataErr) {
      html = await window.chartAPI.generateChart();
      document.getElementById("img-graph-div").innerHTML = html;
      setChartLabel(selectValidatePlateThickness)
      const plateThicknessValue = await window.electronAPI.getConfig("platethickness")
      setPartsData(plateThicknessValue)
      } else {
      document.getElementById("img-graph-div").innerHTML = html;
    }


  }

});

selectPlateThickness.addEventListener("change", async (e) => {
  console.log(e);

  const material = {
    namespace: "material",
    key: "SELECT-MATERIAL",
  };
  const assistGas = {
    namespace: "assist-gas",
    key: "SELECT-ASSISTGAS",
  };
  const plateThickness = {
    namespace: "platethickness",
    key: "SELECT-PLATETHICKNESS",
  };

  await window.electronAPI.setConfig({key:"model1Parts1ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1Parts2ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1Parts3ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1Parts4ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model1ValidateParts", data: null})
  await window.electronAPI.setConfig({key:"model2Parts1ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2Parts2ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2Parts3ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2Parts4ValidatePlateThickness", data: null})
  await window.electronAPI.setConfig({key:"model2ValidateParts", data: null})
  await window.electronAPI.setConfig({key:"selectValidatePlateThickness", data: null})

  await window.electronAPI.setConfig({key:"selectValidatePlateThickness", data: null})
  const selectValidatePlateThickness = await window.electronAPI.getConfig("selectValidatePlateThickness")

  if (e.target.value == "") {
    window.electronAPI.setPlateThickness("")
    document.getElementById(plateThickness.key).classList.add("is-invalid")
  } else {
    let chartDataErr = false
    window.electronAPI.setPlateThickness(e.target.value)
    document.getElementById(plateThickness.key).classList.remove("is-invalid")

    const validateMaterial1 = await window.electronAPI.getConfig("material1ValidatePlateThickness")
    const validateAssistGas1 = await window.electronAPI.getConfig("assistGas1ValidatePlateThickness")
    const validateMaterial2 = await window.electronAPI.getConfig("material2ValidatePlateThickness")
    const validateAssistGas2 = await window.electronAPI.getConfig("assistGas2ValidatePlateThickness")
    const validateParts = await window.electronAPI.getConfig("partsValidatePlateThickness")

    if (!(Array.isArray(validateMaterial1) ? validateMaterial1.includes(e.target.value) : false)) {
      window.electronAPI.setMaterial1("")
      document.getElementById(material.key+"1").classList.add("is-invalid")
      document.getElementById(material.key+"1").options[0].selected = true
      chartDataErr = true
    } else {
      document.getElementById(material.key+"1").classList.remove("is-invalid")
    }
    if (!(Array.isArray(validateAssistGas1) ? validateAssistGas1.includes(e.target.value) : false)) {
      window.electronAPI.setAssistGas1("")
      document.getElementById(assistGas.key+"1").classList.add("is-invalid")
      document.getElementById(assistGas.key+"1").options[0].selected = true
      chartDataErr = true
    } else {
      document.getElementById(assistGas.key+"1").classList.remove("is-invalid")
    }
    if (!(Array.isArray(validateMaterial2) ? validateMaterial2.includes(e.target.value) : false)) {
      window.electronAPI.setMaterial2("")
      document.getElementById(material.key+"2").classList.add("is-invalid")
      document.getElementById(material.key+"2").options[0].selected = true
      chartDataErr = true
    } else {
      document.getElementById(material.key+"2").classList.remove("is-invalid")
    }
    if (!(Array.isArray(validateAssistGas2) ? validateAssistGas2.includes(e.target.value) : false)) {
      window.electronAPI.setAssistGas2("")
      document.getElementById(assistGas.key+"2").classList.add("is-invalid")
      document.getElementById(assistGas.key+"2").options[0].selected = true
      chartDataErr = true
    } else {
      document.getElementById(assistGas.key+"2").classList.remove("is-invalid")
    }
    if (!(Array.isArray(validateParts) ? validateParts.includes(e.target.value) : false)) {
      window.electronAPI.setParts("")
      document.getElementById("img-thumbnail-size").innerHTML = ""
      const locale = await window.electronAPI.getConfig("locale")
      document.getElementById("partsImg").src = "../images/please-select-a-product-" + locale + ".png"
    }

    let html = "No Data"
    if (!chartDataErr) {
      await window.electronAPI.setPlateThickness(e.target.value)
      html = await window.chartAPI.generateChart();
      document.getElementById("img-graph-div").innerHTML = html;
      setChartLabel(selectValidatePlateThickness)
      setPartsData(e.target.value)
      } else {
      document.getElementById("img-graph-div").innerHTML = html;
    }

  }

});

window.httpAPI.onStartMachineName(async (_event, callback) => {
  console.log(JSON.stringify(callback));
  console.log(JSON.stringify(_event));

  const obj = Object.assign({},callback)
  console.log("obj.MachineName:" + obj.MachineName)

  const selectModel = document.getElementById("SELECT-DISPLAY-MODEL")
  if (selectModel != undefined) {
    const num = selectModel.selectedIndex;
    const str = selectModel.options[num].textContent;
    console.log("str:" + str)
    if (str == obj.MachineName) {
      await window.electronAPI.setVideoSpeed("1.0")
      video1HTML.playbackRate = 1.0
      video1HTML.play()
    }
  }

})

window.messageAPI.onChildMessage(async (_event, callback) => {
  console.log(JSON.stringify(callback));
  console.log(JSON.stringify(_event));

  const isDarkMode = await window.darkMode.isDarkMode();

  if (isDarkMode) {
    document.getElementById("navbar").classList.add("navbar-dark");
    document.getElementById("navbar").classList.add("bg-dark");
    // document.getElementById("navmenu").classList.add("dropdown-menu-dark");
  } else {
    document.getElementById("navbar").classList.remove("navbar-dark");
    document.getElementById("navbar").classList.remove("bg-dark");
    // document.getElementById("navmenu").classList.remove("dropdown-menu-dark");
  }
});

homeAnchor.addEventListener("click", async () => {
  console.log("homeAnchor:click")
  window.main.open()
});

window.partsAPI.onPartsChange(async (_event, callback) => {
  console.log(JSON.stringify(callback));
  console.log(JSON.stringify(_event));
  let chartDataErr = false
  console.log("onPartsChange")
  const plateThicknessValue = await window.electronAPI.getConfig("platethickness")
  setPartsData(plateThicknessValue)

  const parts = await window.electronAPI.getConfig("parts")

  const material = {
    namespace: "material",
    key: "SELECT-MATERIAL",
  };
  const assistGas = {
    namespace: "assist-gas",
    key: "SELECT-ASSISTGAS",
  };
  const plateThickness = {
    namespace: "platethickness",
    key: "SELECT-PLATETHICKNESS",
  };

  const validateMaterial1 = await window.electronAPI.getConfig("material1ValidateParts")
  const validateAssistGas1 = await window.electronAPI.getConfig("assistGas1ValidateParts")
  const validateMaterial2 = await window.electronAPI.getConfig("material2ValidateParts")
  const validateAssistGas2 = await window.electronAPI.getConfig("assistGas2ValidateParts")
  const validatePlateThickness = await window.electronAPI.getConfig("plateThicknessValidateParts")

  if (!(Array.isArray(validateMaterial1) ? validateMaterial1.includes(parts) : false)) {
    window.electronAPI.setMaterial1("")
    document.getElementById(material.key+"1").classList.add("is-invalid")
    document.getElementById(material.key+"1").options[0].selected = true
    chartDataErr = true
  } else {
    document.getElementById(material.key+"1").classList.remove("is-invalid")
  }
  if (!(Array.isArray(validateAssistGas1) ? validateAssistGas1.includes(parts) : false)) {
    window.electronAPI.setAssistGas1("")
    document.getElementById(assistGas.key+"1").classList.add("is-invalid")
    document.getElementById(assistGas.key+"1").options[0].selected = true
    chartDataErr = true
  } else {
    document.getElementById(assistGas.key+"1").classList.remove("is-invalid")
  }
  if (!(Array.isArray(validateMaterial2) ? validateMaterial2.includes(parts) : false)) {
    window.electronAPI.setMaterial2("")
    document.getElementById(material.key+"2").classList.add("is-invalid")
    document.getElementById(material.key+"2").options[0].selected = true
    chartDataErr = true
  } else {
    document.getElementById(material.key+"2").classList.remove("is-invalid")
  }
  if (!(Array.isArray(validateAssistGas2) ? validateAssistGas2.includes(parts) : false)) {
    window.electronAPI.setAssistGas2("")
    document.getElementById(assistGas.key+"2").classList.add("is-invalid")
    document.getElementById(assistGas.key+"2").options[0].selected = true
    chartDataErr = true
  } else {
    document.getElementById(assistGas.key+"2").classList.remove("is-invalid")
  }
  if (!(Array.isArray(validatePlateThickness) ? validatePlateThickness.includes(parts) : false)) {
    window.electronAPI.setPlateThickness("")
    document.getElementById(plateThickness.key).classList.add("is-invalid")
    document.getElementById(plateThickness.key).options[0].selected = true
  } else {
    document.getElementById(plateThickness.key).classList.remove("is-invalid")
  }

  let html = "No Data"
  if (!chartDataErr) {
    html = await window.chartAPI.generateChart();
    document.getElementById("img-graph-div").innerHTML = html;
    setChartLabel(plateThicknessValue)
  } else {
    document.getElementById("img-graph-div").innerHTML = html;
  }  

});

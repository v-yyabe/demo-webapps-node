(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
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

document.addEventListener("DOMContentLoaded", async () => {
  const data = {
    namespace: "settings",
    key: "SETTINGS-TITLE",
  };

  document.getElementById(data.key).textContent = await window.langAPI._t(data);
  data.key = "LABEL-DARKMODE";
  document.getElementById(data.key).textContent = await window.langAPI._t(data);

  let isDarkMode = false;

  isDarkMode = await window.darkMode.isDarkMode();
  if (isDarkMode) {
    document.getElementById("flexSwitchCheckDarkMode").checked = true;
  } else {
    document.getElementById("flexSwitchCheckDarkMode").checked = false;
  }
  document.getElementById("THEME-SOURCE").innerHTML = isDarkMode
    ? await window.langAPI._t("DARK")
    : await window.langAPI._t("LIGHT");

  data.key = "LABEL-LOCALE";
  document.getElementById(data.key).textContent = await window.langAPI._t(data);

  data.key = "SELECT-LOCALE";
  const selectLocale = document.getElementById(data.key);
  console.log(await window.langAPI._t(data));
  console.log(await window.langAPI._t(data));
  const locale = await window.electronAPI.getConfig("locale");

  const options = await window.langAPI._t(data);
  for (const key in options) {
    const option = document.createElement("option");
    option.value = key;
    option.innerHTML = options[key];
    if (locale == key) {
      option.selected = true;
    } else {
      option.selected = false;
    }
    selectLocale.appendChild(option);
  }
});

window.addEventListener("load", async () => {
  console.log("Load");
});

const chk = document.getElementById("flexSwitchCheckDarkMode");
chk.addEventListener("change", async () => {
  let isDarkMode = false;
  if (chk.checked) {
    await window.darkMode.dark();
  } else {
    await window.darkMode.light();
  }

  isDarkMode = await window.darkMode.isDarkMode();
  console.log("isDarkMode after:" + isDarkMode);
  document.getElementById("THEME-SOURCE").innerHTML = isDarkMode
    ? await window.langAPI._t("DARK")
    : await window.langAPI._t("LIGHT");

  window.messageAPI.sendMessageToParent({ isDarkMode: isDarkMode });

  // await window.electronAPI.reboot()
});

const selectLocale = document.getElementById("SELECT-LOCALE");
selectLocale.addEventListener("change", async (e) => {
  window.electronAPI.setLocale(e.target.value);
});

// ボタンクリック時の動作
document.querySelectorAll("button").forEach((elem) => {
  elem.addEventListener("click", async () => {
    const lang = elem.getAttribute("data-lang");
    if (lang == "ja" || lang == "en") {
      window.electronAPI.setLocale(lang);
    }
  });
});

document.querySelector("#btn-reset").addEventListener("click", async () => {
  await window.darkMode.light();
  const isDarkMode = await window.darkMode.isDarkMode();
  document.getElementById("THEME-SOURCE").innerHTML = isDarkMode
    ? await window.langAPI._t("DARK")
    : await window.langAPI._t("LIGHT");
  window.electronAPI.reset();
});

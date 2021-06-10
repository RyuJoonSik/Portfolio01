"use strict";

var NAV_LIST = document.getElementById("navList");
var H2S = document.getElementsByTagName("h2");
var H2S_LENGTH = H2S.length;

for (var i = 0; i < H2S_LENGTH; i += 1) {
  var LI = document.createElement("li");
  LI.className = "navigation__list";

  if (i === H2S_LENGTH - 1) {
    LI.style.borderBottom = "none";
  }

  var BUTTON = document.createElement("button");
  BUTTON.className = "navigation__title";
  var SPAN = document.createElement("span");
  SPAN.textContent = H2S[i].innerText;
  var parentEl = H2S[i].parentNode;

  for (; parentEl.nodeName !== "SECTION"; parentEl = parentEl.parentNode) {
    ;
  }

  var H3S = document.querySelectorAll(".".concat(parentEl.className, " h3"));
  var UL = document.createElement("ul");
  UL.className = "navigation__lists-sub";
  var H3S_LENGTH = H3S.length;

  for (var j = 0; j < H3S_LENGTH; j += 1) {
    var _LI = document.createElement("li");

    _LI.className = "navigation__list-sub";

    if (j === H3S_LENGTH - 1) {
      _LI.style.borderBottom = "none";
    }

    var A = document.createElement("a");
    A.href = "#".concat(H3S[j].id);
    A.className = "navigation__title-sub";
    A.title = "\uC774\uB3D9";
    A.textContent = H3S[j].innerText;

    _LI.appendChild(A);

    UL.appendChild(_LI);
  }

  BUTTON.appendChild(SPAN);
  LI.appendChild(BUTTON);
  LI.appendChild(UL);
  NAV_LIST.appendChild(LI);
}

NAV_LIST.addEventListener("click", function (e) {
  if (e.target.nodeName !== "BUTTON") {
    return;
  }

  e.target.classList.toggle("navigation__title--clicked");
  e.target.nextSibling.classList.toggle("navigation__lists-sub--on");
});
NAV_LIST.addEventListener("mouseout", function (e) {
  if (e.target.nodeName !== "BUTTON") {
    return;
  }
});
var BUTTON_HIDE_NAV = document.getElementById("btnHideNav");
BUTTON_HIDE_NAV.addEventListener("click", function (e) {
  e.target.classList.toggle("button-hide--clicked");
  e.target.classList.toggle("button-hide--nav-clicked");
  var NAV_BAR = document.getElementById("nav");
  NAV_BAR.classList.toggle("navigation--show");
});
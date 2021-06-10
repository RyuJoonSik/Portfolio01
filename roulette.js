var rouletteSingleton = (function () {
  var instance;
  var canvas = {
    pixelRatio: null,
    parent: null,
    myCanvas: null,
    ctx: null,
    fontSize: null,
  };
  var circle = {
    centerX: null,
    centerY: null,
    radius: null,
    dividedAngle: null,
  };
  var arrow = {
    X: null,
    Y: null,
    width: null,
  };
  var time = {
    totalTime: 0,
    passedTime: 0,
  };
  var spin = {
    totalSpin: 0,
    spinnedAngle: 0,
  };
  var districts = [];
  var colors = [
    "#B10B77",
    "#804B21",
    "#685B5B",
    "#2254C5",
    "#16675E",
    "#5251A7",
    "#4F5456",
    "#B80235",
  ];

  function initiate() {
    return {
      initialize: function () {
        canvas.parent = document.getElementById("roulette");
        canvas.myCanvas = document.getElementById("canvas");
        canvas.ctx = canvas.myCanvas.getContext("2d");
        canvas.pixelRatio = window.devicePixelRatio;
        canvas.ctx.scale(canvas.pixelRatio, canvas.pixelRatio);
      },

      isEmpty: function () {
        var result = false;

        if (districts.length === 0) {
          result = true;
        }

        return result;
      },

      setSize: function () {
        canvas.myCanvas.width = canvas.parent.offsetWidth * canvas.pixelRatio;
        canvas.myCanvas.height = canvas.parent.offsetWidth * canvas.pixelRatio;

        circle.centerX = canvas.myCanvas.width / 2;
        circle.centerY = canvas.myCanvas.height / 2;
        circle.radius = (canvas.myCanvas.width / 2) * 0.9;

        canvas.fontSize = circle.radius * 0.1 + "px";
        canvas.ctx.font = canvas.fontSize + " sans-serif";

        arrow.X = circle.centerX;
        arrow.Y = circle.centerY - circle.radius;
        arrow.width = circle.radius * 0.1;
      },

      drawArrow: function () {
        var ctx = canvas.ctx;

        ctx.beginPath();
        ctx.fillStyle = "#3F4A58";
        ctx.moveTo(arrow.X, arrow.Y);
        ctx.lineTo(arrow.X + arrow.width, arrow.Y - arrow.width);
        ctx.lineTo(arrow.X - arrow.width, arrow.Y - arrow.width);
        ctx.fill();
      },

      convertToRadian: function (angle) {
        var radian = angle * (Math.PI / 180);

        return radian;
      },

      setAngle: function () {
        circle.dividedAngle = 360 / districts.length;
      },

      setTime: function () {
        var randomTime = ((Math.random() * 10) % 3) + 2;
        var fps = 60;
        time.totalTime = randomTime * fps;
        time.passedTime = 0;
      },

      setSpin: function () {
        var randomSpinCount = ((Math.random() * 10) % 2) + 2;
        var spinAngle = 360;
        spin.totalSpin = randomSpinCount * spinAngle;
      },

      addDistrict: function (district) {
        districts.push(district);
        this.setAngle();
      },

      removeDistrict: function (district) {
        var INDEX = districts.indexOf(district);

        districts.splice(INDEX, 1);
        this.setAngle();
      },

      easingOut: function (t, b, c, d) {
        t /= d;
        t--;

        return c * (t * t * t + 1) + b;
      },

      divideCircle: function (piece) {
        var ctx = canvas.ctx;
        var x = circle.centerX;
        var y = circle.centerY;
        var angle = circle.dividedAngle;

        ctx.beginPath();
        ctx.moveTo(x, y);

        var spinnedAngle = spin.spinnedAngle;
        var startAngle = piece * angle + spinnedAngle;
        var endAngle = startAngle + angle;

        ctx.arc(
          x,
          y,
          circle.radius,
          this.convertToRadian(startAngle),
          this.convertToRadian(endAngle)
        );
        ctx.strokeStyle = "transparent";
        ctx.stroke();
        ctx.fillStyle = colors[piece % colors.length];
        ctx.fill();
      },

      addText: function (piece) {
        var ctx = canvas.ctx;
        ctx.fillStyle = "#ffffff";
        ctx.save();
        var angle = circle.dividedAngle;
        var radius = circle.radius;
        var x = circle.centerX;
        var y = circle.centerY;
        var spinnedAngle = spin.spinnedAngle;
        var textAngle = angle / 2 + piece * angle + spinnedAngle;
        var textPosition = radius * 0.9;

        ctx.translate(
          x + Math.cos(this.convertToRadian(textAngle)) * textPosition,
          y + Math.sin(this.convertToRadian(textAngle)) * textPosition
        );

        var startAngle = piece * angle;
        var endAngle = startAngle + angle;
        var textRotate = 90 + startAngle / 2 + endAngle / 2 + spinnedAngle;

        ctx.rotate(this.convertToRadian(textRotate));
        ctx.fillText(
          districts[piece],
          -ctx.measureText(districts[piece]).width / 2,
          0
        );
        ctx.restore();
      },

      drawRoulette: function () {
        var length = districts.length;

        canvas.ctx.clearRect(
          0,
          0,
          canvas.myCanvas.width,
          canvas.myCanvas.height
        );

        this.drawArrow();
        for (var j = 0; j < length; j += 1) {
          this.divideCircle(j);
          this.addText(j);
        }
      },

      spinRoulette: function () {
        var passedTime = time.passedTime;
        var totalTime = time.totalTime;

        if (passedTime < totalTime) {
          var totalSpin = spin.totalSpin;
          passedTime = time.passedTime += 1;
          spin.spinnedAngle = this.easingOut(
            passedTime,
            0,
            totalSpin,
            totalTime
          );

          this.drawRoulette();
          window.requestAnimationFrame(this.spinRoulette.bind(this));
        } else {
          this.stopRoulette();
        }
      },

      stopRoulette: function () {
        var spinnedAngle = spin.spinnedAngle;
        var dividedAngle = circle.dividedAngle;
        var startAngle = spinnedAngle + 90;
        var index = Math.floor((360 - (startAngle % 360)) / dividedAngle);

        alert(districts[index]);
      },
    };
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = initiate();
      }

      return instance;
    },
  };
})();

var district = {
  서울: [
    "종로구",
    "중구",
    "용산구",
    "성동구",
    "광진구",
    "동대문구",
    "중랑구",
    "성북구",
    "강북구",
    "도봉구",
    "노원구",
    "은평구",
    "서대문구",
    "마포구",
    "양천구",
    "강서구",
    "구로구",
    "금천구",
    "영등포구",
    "동작구",
    "관악구",
    "서초구",
    "강남구",
    "송파구",
    "강동구",
  ],
  부산: [
    "중구",
    "서구",
    "동구",
    "영도구",
    "부산진구",
    "동래구",
    "남구",
    "북구",
    "강서구",
    "해운대구",
    "사하구",
    "금정구",
    "연제구",
    "수영구",
    "사상구",
    "기장군",
  ],
  대구: ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군"],
  인천: [
    "중구",
    "동구",
    "미추홀구",
    "연수구",
    "남동구",
    "부평구",
    "계양구",
    "서구",
    "강화군",
    "옹진군",
  ],
  광주: ["동구", "서구", "남구", "북구", "광산구"],
  대전: ["동구", "중구", "서구", "유성구", "대덕구"],
  울산: ["중구", "남구", "동구", "북구", "울주군"],
  세종: [],
  경기도: [
    "수원시",
    "성남시",
    "안양시",
    "안산시",
    "용인시",
    "부천시",
    "광명시",
    "평택시",
    "과천시",
    "오산시",
    "시흥시",
    "군포시",
    "의왕시",
    "하남시",
    "이천시",
    "안성시",
    "김포시",
    "화성시",
    "광주시",
    "여주시",
    "양평군",
    "고양시",
    "의정부시",
    "동두천시",
    "구리시",
    "남양주시",
    "파주시",
    "양주시",
    "포천시",
    "연천군",
    "가평군",
  ],
  강원도: [
    "춘천시",
    "원주시",
    "강릉시",
    "동해시",
    "태백시",
    "속초시",
    "삼척시",
    "홍천군",
    "횡성군",
    "영월군",
    "평창군",
    "정선군",
    "철원군",
    "화천군",
    "양구군",
    "인제군",
    "고성군",
    "양양군",
  ],
  충청도: [
    "청주시",
    "충주시",
    "제천시",
    "보은군",
    "옥천군",
    "영동군",
    "증평군",
    "진천군",
    "괴산군",
    "음성군",
    "단양군",
    "천안시",
    "공주시",
    "보령시",
    "아산시",
    "서산시",
    "논산시",
    "계룡시",
    "당진시",
    "금산군",
    "부여군",
    "서천군",
    "청양군",
    "홍성군",
    "예산군",
    "태안군",
  ],
  전라도: [
    "전주시",
    "군산시",
    "익산시",
    "정읍시",
    "남원시",
    "김제시",
    "완주군",
    "진안군",
    "무주군",
    "장수군",
    "임실군",
    "순창군",
    "고창군",
    "부안군",
    "목포시",
    "여수시",
    "순천시",
    "나주시",
    "광양시",
    "담양군",
    "곡성군",
    "구례군",
    "고흥군",
    "보성군",
    "화순군",
    "장흥군",
    "강진군",
    "해남군",
    "영암군",
    "무안군",
    "함평군",
    "영광군",
    "장성군",
    "완도군",
    "진도군",
    "신안군",
  ],
  경상도: [
    "포항시",
    "경주시",
    "김천시",
    "안동시",
    "구미시",
    "영주시",
    "영천시",
    "상주시",
    "문경시",
    "경산시",
    "군위군",
    "의성군",
    "청송군",
    "영양군",
    "영덕군",
    "청도군",
    "고령군",
    "성주군",
    "칠곡군",
    "예천군",
    "봉화군",
    "울진군",
    "울릉군",
    "창원시",
    "진주시",
    "통영시",
    "사천시",
    "김해시",
    "밀양시",
    "거제시",
    "양산시",
    "의령군",
    "함안군",
    "창녕군",
    "고성군",
    "남해군",
    "하동군",
    "산청군",
    "함양군",
    "거창군",
    "합천군",
  ],
  제주도: ["제주시", "서귀포시"],
};

var districtList = document.getElementById("districtList");
var startButton = document.getElementById("startBtn");
var roulette = rouletteSingleton.getInstance();
var btnHide = document.getElementById("btnHide");
var fragment = document.createDocumentFragment();
var districtNumber = 0;
var i,
  li,
  subLi,
  btn,
  subBtn,
  em,
  ul,
  span,
  subSpan,
  data,
  count,
  districtLength;

for (count in district) {
  if (Object.prototype.hasOwnProperty.call(district, count)) {
    districtNumber += 1;
  }
}

count = 0;

for (data in district) {
  if (Object.prototype.hasOwnProperty.call(district, data)) {
    li = document.createElement("li");
    li.className = "district__list";

    count += 1;
    if (count === districtNumber) {
      li.style.borderBottom = "none";
    }

    btn = document.createElement("button");
    btn.className = "district__name";

    span = document.createElement("span");
    span.textContent = data;

    em = document.createElement("em");
    em.className = "district__number";

    ul = document.createElement("ul");
    ul.className = "sub-district";

    districtLength = district[data].length;

    for (i = 0; i < districtLength; i += 1) {
      subLi = document.createElement("li");
      subLi.className = "sub-district__list";

      if (i === districtLength - 1) {
        subLi.style.borderBottom = "none";
      }

      subBtn = document.createElement("button");
      subBtn.className = "sub-district__name";

      subSpan = document.createElement("span");
      subSpan.textContent = district[data][i];

      subBtn.appendChild(subSpan);
      subLi.appendChild(subBtn);
      ul.appendChild(subLi);
    }

    btn.appendChild(span);
    li.appendChild(btn);
    li.appendChild(em);
    li.appendChild(ul);
    fragment.appendChild(li);
  }
}

districtList.appendChild(fragment);

roulette.initialize();
roulette.setSize();
roulette.drawArrow();

window.addEventListener("resize", function () {
  roulette.setSize();
  roulette.drawRoulette();
});

districtList.addEventListener("click", function (e) {
  if (e.target.nodeName !== "BUTTON") {
    return;
  }

  if (e.target.classList.contains("district__name")) {
    var UL = e.target.nextSibling;

    for (; UL.nodeName !== "UL"; UL = UL.nextSibling);

    e.target.classList.toggle("district__name--checked");
    UL.classList.toggle("sub-district--checked");
  } else if (e.target.classList.contains("sub-district__name")) {
    var EM = e.target.parentNode.parentNode;

    for (; EM.nodeName !== "EM"; EM = EM.previousSibling);
    e.target.classList.toggle("sub-district__name--checked");

    if (e.target.classList.contains("sub-district__name--checked")) {
      roulette.addDistrict(e.target.innerText);
      roulette.drawRoulette();

      EM.innerText =
        EM.innerText === "" ? "1" : (parseInt(EM.innerText) + 1).toString();
    } else {
      roulette.removeDistrict(e.target.innerText);
      roulette.drawRoulette();

      EM.innerText =
        EM.innerText === "1"
          ? (EM.innerText = "")
          : (parseInt(EM.innerText) - 1).toString();
    }

    if (!roulette.isEmpty()) {
      startButton.classList.add("roulette__button-start--activated");
    } else {
      startButton.classList.remove("roulette__button-start--activated");
    }
  }
});

startButton.addEventListener("click", function () {
  if (roulette.isEmpty()) {
    alert("지역을 선택해주세요.");

    return;
  }

  roulette.setTime();
  roulette.setSpin();
  roulette.spinRoulette();
});

btnHide.addEventListener("click", function () {
  btnHide.classList.toggle("button-hide--clicked");

  if (btnHide.classList.contains("button-hide--clicked")) {
    districtList.classList.add("district--on");
  } else {
    districtList.classList.remove("district--on");
  }
});

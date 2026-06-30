let n2Slider;
let angleSlider;
let angleInput;
let angleMarker = 56; // 現在の入射角
function setup() {
 createCanvas(1150, 700);
 textFont('sans-serif');
 n2Slider = createSlider(1.0, 2.5, 1.5, 0.01);
 n2Slider.position(30, 55);
 n2Slider.style('width', '220px');
 angleSlider = createSlider(0, 90, 56, 0.1);
 angleSlider.position(30, 95);
 angleSlider.style('width', '220px');
 angleSlider.input(syncAngleFromSlider);
 angleInput = createInput("56", "number");
 angleInput.position(265, 95);
 angleInput.size(70);
 angleInput.input(syncAngleFromInput);
}
function draw() {
 background(250);
 let n1 = 1.0;
 let n2 = n2Slider.value();
 fill(0);
 noStroke();
 textSize(22);
 text("s 偏光・p 偏光の反射率シミュレーション", 30, 25);
 textSize(14);
 text("反射面の屈折率 n₂", 30, 50);
 text(nf(n2, 1, 2), 265, 55);
 text("入射角 θᵢ", 30, 95);
 text(nf(angleMarker, 1, 1) + "°", 345, 110);
 // 左：模式図
 drawDiagram(40, 140, 330, 240, n1, n2, angleMarker);
 // 右：グラフ
 let gx = 520;
 let gy = 100;
 let gw = 540;
 let gh = 380;
 drawGraphFrame(gx, gy, gw, gh);
 drawCurves(gx, gy, gw, gh, n1, n2);
 drawBrewsterLine(gx, gy, gw, gh, n1, n2);
 drawMouseMarker(gx, gy, gw, gh, n1, n2);
 // 下部説明
 drawInfoPanel(40, 410, n1, n2);
}
function mouseMoved() {
 let gx = 520;
 let gy = 90;
 let gw = 540;
 let gh = 380;
 if (mouseX >= gx && mouseX <= gx + gw && mouseY >= gy && mouseY <= gy + gh) {
 angleMarker = map(mouseX, gx, gx + gw, 0, 90);
 angleMarker = constrain(angleMarker, 0, 90);
 angleSlider.value(angleMarker);
 angleInput.value(nf(angleMarker, 1, 1));
 }
}
function syncAngleFromSlider() {
 angleMarker = float(angleSlider.value());
 angleInput.value(nf(angleMarker, 1, 1));
}
function syncAngleFromInput() {
 let v = float(angleInput.value());
 if (!isNaN(v)) {
 v = constrain(v, 0, 90);
 angleMarker = v;
 angleSlider.value(v);
 }
}
// ----------------------------
// グラフ本体
// ----------------------------
function drawGraphFrame(x, y, w, h) {
 fill(20);
 noStroke();
 textSize(17);
 text("反射率 R と入射角 θᵢ の関係", x, y - 18);
 stroke(0);
 strokeWeight(1);
 noFill();
 rect(x, y, w, h);
 // 補助線
 stroke(220);
 for (let i = 1; i < 9; i++) {
 let yy = y + h * i / 10;
 line(x, yy, x + w, yy);
 }
 for (let a = 10; a < 90; a += 10) {
 let xx = map(a, 0, 90, x, x + w);
 line(xx, y, xx, y + h);
 }
 // 軸ラベル
 noStroke();
 fill(0);
 textSize(12);
 for (let a = 0; a <= 90; a += 10) {
 let xx = map(a, 0, 90, x, x + w);
 text(a + "°", xx - 10, y + h + 18);
 }
 for (let r = 0; r <= 10; r += 2) {
 let val = 1 - r / 10;
 let yy = map(val, 0, 1, y + h, y);
 text(nf(val, 1, 1), x - 28, yy + 4);
 }
 textSize(14);
 text("入射角 θᵢ", x + w / 2 - 20, y + h + 40);
 push();
 translate(x - 45, y + h / 2 + 25);
 rotate(-HALF_PI);
 text("反射率 R", 0, 0);
 pop();
 // 凡例
 strokeWeight(3);
 stroke(40, 100, 255);
 line(x + 20, y + 20, x + 60, y + 20);
 noStroke();
 fill(0);
 text("s 偏光", x + 70, y + 25);
 stroke(220, 60, 60);
 line(x + 140, y + 20, x + 180, y + 20);
 noStroke();
 fill(0);
 text("p 偏光", x + 190, y + 25);
}
function drawCurves(x, y, w, h, n1, n2) {
 // s 偏光
 noFill();
 stroke(40, 100, 255);
 strokeWeight(3);
 beginShape();
 for (let ang = 0; ang <= 90; ang += 0.3) {
 let Rs = fresnelRs(n1, n2, radians(ang));
 let px = map(ang, 0, 90, x, x + w);
 let py = map(Rs, 0, 1, y + h, y);
 vertex(px, py);
 }
 endShape();
 // p 偏光
 noFill();
 stroke(220, 60, 60);
 strokeWeight(3);
 beginShape();
 for (let ang = 0; ang <= 90; ang += 0.3) {
 let Rp = fresnelRp(n1, n2, radians(ang));
 let px = map(ang, 0, 90, x, x + w);
 let py = map(Rp, 0, 1, y + h, y);
 vertex(px, py);
 }
 endShape();
}
function drawBrewsterLine(x, y, w, h, n1, n2) {
 if (n2 > 0) {
 let brew = degrees(atan2(n2, n1));
 if (brew >= 0 && brew <= 90) {
 let bx = map(brew, 0, 90, x, x + w);
 stroke(80);
 strokeWeight(1.5);
 drawingContext.setLineDash([6, 6]);
 line(bx, y, bx, y + h);
 drawingContext.setLineDash([]);
 noStroke();
 fill(60);
 textSize(12);
 text("ブリュースター角 ≈ " + nf(brew, 1, 1) + "°", bx - 60, y + 18);
 }
 }
}
function drawMouseMarker(x, y, w, h, n1, n2) {
 let ang = constrain(angleMarker, 0, 90);
 let Rs = fresnelRs(n1, n2, radians(ang));
 let Rp = fresnelRp(n1, n2, radians(ang));
 let mx = map(ang, 0, 90, x, x + w);
 let ys = map(Rs, 0, 1, y + h, y);
 let yp = map(Rp, 0, 1, y + h, y);
 stroke(90);
 strokeWeight(1.5);
 drawingContext.setLineDash([4, 4]);
 line(mx, y, mx, y + h);
 drawingContext.setLineDash([]);
 noStroke();
 fill(40, 100, 255);
 circle(mx, ys, 10);
 fill(220, 60, 60);
 circle(mx, yp, 10);
 fill(255);
 stroke(100);
 strokeWeight(1);
 rect(x + 300, y + 35, 200, 72, 10);
 noStroke();
 fill(0);
 textSize(13);
 text("θᵢ = " + nf(ang, 1, 1) + "°", x + 315, y + 58);
 text("Rs = " + nf(Rs, 1, 3), x + 315, y + 78);
 text("Rp = " + nf(Rp, 1, 3), x + 315, y + 98);
}
// ----------------------------
// 模式図
// ----------------------------
function drawDiagram(x, y, w, h, n1, n2, angDeg) {
 fill(20);
 noStroke();
 textSize(17);
 text("反射の模式図", x, y - 5);
 // 上下媒質
 noStroke();
 fill(235, 245, 255);
 rect(x, y, w, h / 2);
 fill(230, 255, 235);
 rect(x, y + h / 2, w, h / 2);
 stroke(0);
 strokeWeight(2);
 line(x, y + h / 2, x + w, y + h / 2);
 noStroke();
 fill(0);
 textSize(14);
 text("空気 n₁ = " + nf(n1, 1, 1), x + 15, y + 28);
 text("媒質 n₂ = " + nf(n2, 1, 2), x + 15, y + h / 2 + 28);
 let cx = x + 170;
 let cy = y + h / 2;
 let len = 90;
 let ang = radians(angDeg);
 // 法線
 stroke(120);
 strokeWeight(1.5);
 drawingContext.setLineDash([5, 5]);
 line(cx, y + 10, cx, y + h - 10);
 drawingContext.setLineDash([]);
 // 入射線
 stroke(40);
 strokeWeight(3);
 let x1 = cx - len * sin(ang);
 let y1 = cy - len * cos(ang);
 line(x1, y1, cx, cy);
 drawArrowHead(x1, y1, cx, cy);
 // 反射線
 stroke(200, 80, 0);
 let xr = cx + len * sin(ang);
 let yr = cy - len * cos(ang);
 line(cx, cy, xr, yr);
 drawArrowHead(cx, cy, xr, yr);
 // 屈折線
 let sinT = n1 / n2 * sin(ang);
 let xt = null;
 let yt = null;
 if (sinT <= 1) {
 let th2 = asin(sinT);
 stroke(0, 150, 70);
 xt = cx + len * sin(th2);
 yt = cy + len * cos(th2);
 line(cx, cy, xt, yt);
 drawArrowHead(cx, cy, xt, yt);
 }
 // 角度の円弧表示
 let rArc = 42;
 let incidentDir = atan2(y1 - cy, x1 - cx); // 左上
 let reflectDir = atan2(yr - cy, xr - cx); // 右上
 let normalUp = -HALF_PI;
 let normalDown = HALF_PI;
 // 入射角（左上）
 drawAngleArc(cx, cy, rArc, incidentDir, normalUp, color(0), "θi");
 // 反射角（右上）
 drawAngleArc(cx, cy, rArc + 12, normalUp, reflectDir, color(200, 80, 0), "θr");
 // 屈折角（右下）
 if (sinT <= 1 && xt !== null && yt !== null) {
 let transmitDir = atan2(yt - cy, xt - cx);
 // 修正版（反時計回りになる）
 drawAngleArc(cx, cy, rArc + 24, transmitDir, normalDown, color(0, 150, 70), "θt");
 }
 // s, p の向き
 noStroke();
 fill(40, 100, 255);
 textSize(13);
 text("s 偏光：紙面に垂直", x + 15, y + h - 48);
 fill(220, 60, 60);
 text("p 偏光：入射面内", x + 15, y + h - 24);
}
function drawArrowHead(x1, y1, x2, y2) {
 let a = atan2(y2 - y1, x2 - x1);
 let s = 10;
 line(x2, y2, x2 - s * cos(a - 0.35), y2 - s * sin(a - 0.35));
 line(x2, y2, x2 - s * cos(a + 0.35), y2 - s * sin(a + 0.35));
}
// ----------------------------
// 情報表示
// ----------------------------
function drawInfoPanel(x, y, n1, n2) {
 fill(20);
 noStroke();
 textSize(17);
 text("読み取りポイント", x, y);
 textSize(14);
 text("・s 偏光は入射角が大きいほど反射率が増えやすい", x, y + 30);
 text("・p 偏光は途中で反射率が 0 になる角度があり、これがブリュースター角", x, y + 55);
 text("・n₂ が大きいほど、全体として反射率は上がりやすい", x, y + 80);
 text("・また n₂ が大きいほど、ブリュースター角は大きい角度側へ移動する", x, y + 105);
 let brew = degrees(atan2(n2, n1));
 let R0 = sq((n1 - n2) / (n1 + n2));
 fill(255);
 stroke(150);
 rect(x + 10, y + 145, 430, 120, 12);
 noStroke();
 fill(0);
 textSize(15);
 text("現在の主な値", x + 25, y + 170);
 textSize(14);
 text("法線入射での反射率 R(0°) = ((n₁ - n₂)/(n₁ + n₂))²", x + 25, y + 198);
 text(" = " + nf(R0, 1, 4), x + 25, y + 222);
 text("ブリュースター角 θB = arctan(n₂/n₁) = " + nf(brew, 1, 2) + "°", x + 25, y + 246);
}
// ----------------------------
// フレネル反射率
// ----------------------------
function fresnelRs(n1, n2, th1) {
 let s1 = sin(th1);
 let c1 = cos(th1);
 let s2 = n1 / n2 * s1;
 if (s2 > 1) return 1;
 let c2 = sqrt(1 - s2 * s2);
 let rs = (n1 * c1 - n2 * c2) / (n1 * c1 + n2 * c2);
 return rs * rs;
}
function fresnelRp(n1, n2, th1) {
 let s1 = sin(th1);
 let c1 = cos(th1);
 let s2 = n1 / n2 * s1;
 if (s2 > 1) return 1;
 let c2 = sqrt(1 - s2 * s2);
 let rp = (n2 * c1 - n1 * c2) / (n2 * c1 + n1 * c2);
 return rp * rp;
}
// ----------------------------
// 円弧描画
// ----------------------------
function drawAngleArc(cx, cy, r, aStart, aEnd, col, label) {
 aStart = wrapTo2Pi(aStart);
 aEnd = wrapTo2Pi(aEnd);
 noFill();
 stroke(col);
 strokeWeight(2);
 arc(cx, cy, r * 2, r * 2, aStart, aEnd);
 let mid = angleMid(aStart, aEnd);
 let tx = cx + (r + 14) * cos(mid);
 let ty = cy + (r + 14) * sin(mid);
 noStroke();
 fill(col);
 textSize(12);
 text(label, tx - 8, ty + 4);
}
function wrapTo2Pi(a) {
 while (a < 0) a += TWO_PI;
 while (a >= TWO_PI) a -= TWO_PI;
 return a;
}
function angleMid(a1, a2) {
 let d = a2 - a1;
 if (d < 0) d += TWO_PI;
 return wrapTo2Pi(a1 + d / 2);
} 

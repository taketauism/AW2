// chart.js
function ______chart_______(){}
// readCandle用のパラメータ
var barsParam ={   
    //perterm: {cf1万以上:[BARS, left,right],  cf千円台:[]、　cf千円未満:[]
    '1,1':    {546: [302,   18, 512],     554: [302,   18, 512],     562: [302,    22, 520],   578: [302,      21, 535] },
    '5,1':    {546: [62*1, 22, 516],     554: [62*1, 22, 516],     562: [62*1,  22, 524],   578: [62*1,    23, 539] },
    '5,2':    {546: [62*2, 20, 518],     554: [62*2, 20, 518],     562: [62*2,  20, 526],   578: [62*2,    21, 541] },
    '5,3':    {546: [62*3, 19, 519],     554: [62*3, 19, 519],     562: [62*3,  22, 527],   578: [62*3,    20, 540] },  
    '5,5':    {546: [62*5, 18, 520],     554: [62*5, 18, 520],     562: [62*5,  19, 527],   578: [62*5,    21, 540] }, 
    '5,10':  {546: [62*10,18, 520],    554: [62*10,18, 520],    562: [62*10, 18, 527],   578: [62*10,  21, 542] },
    '15,5':  {546: [22*5,  20, 518],    554: [22*5,  20, 518],    562: [22*5,   20, 525],   578: [22*5,   21, 540] },
    '15,10': {546: [22*10,19, 519],    554: [22*10,19, 519],    562: [22*10, 19, 527],   578: [22*10, 20, 542] },
    '15,20': {546: [22*20,18, 519],    554: [22*20,18, 519],    562: [22*20, 18, 527],   578: [22*20, 19, 542] },
    '60,5':   {554: [7*5,  25, 513],     562: [7*5,  25, 520],      578: [7*5,  26, 535 ],     578: [7*5,  26, 535] },
    '60,10': {546: [7*10,  21, 517],    554: [7*10,  21, 517],    562: [7*10,  22, 524 ],   578: [7*10,  23, 539] },
    '60,20': {546: [7*20,  20, 515],    554: [7*20,  20, 515],    562: [7*20,  20 , 522],   578: [7*20,  20, 537] },
    'D,60':   {546: [60,     22, 516],    554: [60,     22, 516],    562: [60,     22,  524],   578: [60,      23, 538] },
    'D,120': {546: [120,   20,  518],    554: [120,   20,  518],    562: [120,   19,  526],   578: [120,    21, 541] }, 
    'D,240': {546: [240,   20,  519],    554: [240,   20,  519],    562: [240,   20,  527],   578: [240,    20, 542] },
    'W,104': {546: [260,  20,  518],    554: [260,  20,  518],    562: [260,   21,  525],    578: [260,   22, 540] }, 
    'W,156': {546: [260,  19,  519],    554: [260,  19,  519],    562: [260,   20,  526],    578: [260,   21, 541] }, 
    'W,260': {546: [260,  19,  519],    554: [260,  19,  519],    562: [260,   18,  527],    578: [260,   20, 542] }, 
    'M,120': {546: [120,  20,   518],    554: [120,  20,   518],    562: [120,  20,  526],    578: [120,    21, 541] } };

//============================================
var _pane = function(h){
	this.x0= 0;
	this.y0= 0;
	this.w = 512;
	this.h = 1;
	this.Mx= 0;
	this.Mn= 0;	//paneのmin val
	this.topmgn   =  1;
	this.btmmgn   = 1;
	this.leftmgn  = 10;
	this.rightmgn = 10;
	this.scaleSz  = 5;
	this.gridColor= '#e0e0e0';
	this.textColor= '#a0a0a0';
}
var gCanvasHeight;
var cw, ch, latestX = -1;
var _chart = function(){
	this.code;
	this.chartType = 'SB';
	this.randomStr = '';
	this.tf      = 'D';
	this.term    = 120;    //バーの描画本数
	this.BARS= 0;      //表示されているBARの数
    this.latestX;     //右端のバーのx座標
	this.barPitch= 4.6;      //バーの横軸方向のピッチ(自動計算される)
    this.leftmostX;     //左端のバーのx座標
	this.canvas;
	this.ctx;
	this.top = 0;
	this.left = 5;
	this.w   = 590;
	this.h    = 390;
	this.nextY0     = this.top;
	this.paneNum = 0;
	this.pane    = {};
	this.cf;		            // 右端frameの枠線位置
	this.gl    = 0;	        // 左端のグリッド位置            09:00
	this.gr   = 620;		// 最終日 の右端グリッド位置　15:00 
	this.g1u = 3;       //upper_chart の上限
	this.g1d = 190;   //upper_chartの下限
	this.g2u = 206;	// lower_chartの100%
	this.g2d = 278;	// lower_chartの0%
	this.axPrc ={u:-999999,Yu:-999999, d:-999999,Yd:-999999};   //価格軸値と座標
	this.axInd = {u:100,Yu:-999999, d:-100,Yd:-999999};   //インジケータ値と座標
	this.PriceOf1px; // Donchanの許容誤差
	this.sd;
    this.ohlc = [[]]; 
    this.RCI = [];
    gCanvasHeight = this.h;
};

_chart.prototype = {
    init: function (code) {
		this.code   = code;
		this.canvas = document.getElementById(code);	//new canvas();
		this.ctx    = this.canvas.getContext('2d');
		this.h      = gCanvasHeight;
		this.fillRect(this.left, this.top,this.w,this.h,'#ffffff');
		this.nextY0 = this.top;//左上の座標セット
		plot.setCTX(this.ctx);	//plot.ctxをセット
	},
    erase: function () {
		this.ctx.fillStyle = '#ffffff';
		this.ctx.fillRect(this.left, this.top, this.w, this.h);
	},
	layout: function(paneNum,height,numOfVerticalGrid,term,vMn,vMx){
		if(this.pane[paneNum]!=undefined) {	//すでに定義されていたら
			return;
		}
		var p= new _pane(); 
		p.h  = height;
		p.x0 = this.left+p.leftmgn;
		p.y0 = this.nextY0;
		this.pane[paneNum] = p;
		this.paneNum = paneNum;
		this.nextY0  = this.nextY0  + height;
		//horizontal grid
		var ymx = p.y0+p.topmgn;
		var ymn = p.y0+p.h-p.btmmgn;
		var unit = this.calcScaleUnit(ymn-ymx,vMx,vMn);
		var dy = (ymx-ymn)/(vMx-vMn)*unit;
		p.Mx = vMx+p.topmgn/dy*unit;
		p.Mn = vMn-p.btmmgn/dy*unit;
        if(paneNum==0) return;

		var ctx = Chart.ctx;
//		Chart.fillRect(p.x0,p.y0,p.w,p.h,'#d0d0d0');
		ctx.strokeStyle = '#808080'; ctx.lineWidth = 0.5;
		ctx.beginPath();
		var plft = this.left;
		var prgt = Chart.cf;        //this.left+p.w+p.leftmgn+p.rightmgn;
		ctx.moveTo(plft,p.y0);
		ctx.lineTo(prgt, p.y0);
		ctx.lineTo(prgt, p.y0+p.h);
		ctx.lineTo(plft, p.y0+p.h);
		ctx.lineTo(plft, p.y0);
		ctx.stroke();
		//vertical grid
		ctx.strokeStyle = '#d0d0d0'; 
		var dx   = p.w/numOfVerticalGrid; 
		for(var i=1; i<numOfVerticalGrid; i++){
			//this.vline_( p.x0+i*dx, p.y0, p.h, '#d0d0d0');
            ctx.moveTo(p.x0+i*dx, p.y0);
            ctx.lineTo(p.x0+i*dx, p.y0+p.h);
			//メインチャートなら最下部に日付けを表示
			if(paneNum==0) {
				var ix = (numOfVerticalGrid - i)*this.term/numOfVerticalGrid;
				//vertical grid位置のohlcのtimeが存在していれば、日付けを表示
				if( ix<ohlc.length ) {
					var dts = UTC2DateString(ohlc[ix][1]).slice(5).replace('-','/');
					var offset = dts.indexOf('/')==1 ? 8: 14;
					this.drawText(p.x0+i*dx-offset, p.y0+p.h, dts,'#606060');
				}
			}
		}
		var i0= Math.ceil(vMn/unit);
		//axis text
		for(var i=i0; i*unit<vMx; i++){
			this.hline_( plft, ymn+(i*unit-vMn)/unit*dy, prgt-plft,  '#d0d0d0');
			var val = i*unit;
			if(val>=1000000) val = (i*unit/1000000)+'M';
			if(val>=10000) val = (i*unit/1000)+'K';
			this.drawText(prgt+3,ymn+(i*unit-vMn)/unit*dy+3,val, '#606060');
		}
		//fibonacci mark on main pane
		// if(paneNum==0) {
			// dy = ymx-ymn;
			// this.hline_( plft, 0.236*dy+ymn, 7,  '#808080');
			// this.hline_( plft, 0.309*dy+ymn, 5,  '#00aa00');
			// this.hline_( plft, 0.382*dy+ymn, 7,  '#808080');
			// this.hline_( plft, 0.5  *dy+ymn,532, '#70aa70');
			// this.hline_( plft, 0.618*dy+ymn, 7,  '#808080');
			// this.hline_( plft, 0.809*dy+ymn, 5,  '#00aa00');
			// this.hline_( plft, 0.764*dy+ymn, 7,  '#808080');
		// }
		ctx.stroke();
	},
    drawText: function (x,y,text, color) {
		var ctx = Chart.ctx;
		ctx.font = '9pt Arial';  ctx.fillStyle = color;  ctx.fillText(text, x, y);
	},
	fillRect: function (x,y,w,h,color) {
		var ctx = Chart.ctx;
		ctx.fillStyle = color;  ctx.fillRect(x, y, w, h);
	},
	vline: function(paneNum, bar, color,width) {
        var latestX=Chart.latestX;     //右端のバーのx座標
        var bp       = Chart.barPitch ;      //バーの横軸方向のピッチ(自動計算される)
        var xx       = latestX - bar*bp;
        this.vline_( paneNum, xx, color, width);
    },
	vline_: function(paneNum, x, color,width) {
        var width_ = !width ? 1:  width;
        var xx = 0.5+Math.floor(x);
		var ctx = Chart.ctx;
		var p = this.pane[paneNum];
		var ymx = p.y0+p.topmgn;
		var ymn = p.y0-p.btmmgn+p.h;
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		ctx.beginPath();
		ctx.moveTo(xx, ymx);
		ctx.lineTo(xx, ymn);
		ctx.stroke();
	},
	hline_: function(x, y, w , color,width) {
        var width_ = !width ? 1:  width;
        var yy = 0.5+Math.floor(y);
		var ctx = Chart.ctx;
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		ctx.beginPath();
		ctx.moveTo(x, yy);
		ctx.lineTo(x+w, yy);
		ctx.stroke();
	},
	hline: function(paneNum,val,color,width) {
		var p = this.pane[paneNum];
		var ymx = p.y0+p.topmgn;
		var ymn = p.y0-p.btmmgn+p.h;
		var coef= (ymx-ymn)/(p.Mx-p.Mn);
		var plft = 0;
		var prgt = Chart.cf;     // this.left+p.w+p.leftmgn+p.rightmgn;
        var yy = ymn+(val-p.Mn)*coef;
		this.hline_( plft, yy, prgt-plft,  color, width);
	},
	calcScaleUnit: function(paneHeight,vmax,vmin){
		var range = vmax-vmin;
		var mult  = 1;
		var unit  = 1;
		while(range>100) {
			mult *= 10;
			range /= 10;
		}
		range = Math.round(range);
		if(range>=50) unit = 10*mult;
		else if(range>=20) unit = 5*mult;
		else if(range>=10) unit = 2*mult;
		else unit = mult;
		//paneの高さが100px以下ならgrid本数を少なく
		if(paneHeight<=50)
			unit *=5;
		else if(paneHeight<=100)
			unit *=2;
		return unit;
	}
}


var _plot = function(){
	this.ctx;
};
_plot.prototype = {
	setCTX:   function(ctx){
		this.ctx= ctx;
	},
    line    : function (paneNum,dataAr,ix, color, width) {
        var BARS    = Chart.BARS;    //バーの描画本数
        var latestX=Chart.latestX;     //右端のバーのx座標
        var bp        = Chart.barPitch ;      //バーの横軸方向のピッチ(自動計算される)
        var xleft     = Chart.gl;
		var ctx=this.ctx;
		var p = Chart.pane[paneNum];
		var u = p.Mx;  var Yu = p.y0+p.topmgn;
		var d = p.Mn;  var Yd = p.y0-p.btmmgn+p.h;
		var coef = (Yu-Yd)/(u-d+1);
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		ctx.beginPath();
		var plft = p.x0;
		var prgt = p.x0+p.w;
		var py0 = p.y0;
		var py1 = py0+p.h;
		var yx  = (dataAr[0][ix]-d)*coef+Yd;
//		ctx.moveTo(p.x0+p.w, yx);
		for(var i=0; i<Math.min(dataAr.length,Chart.BARS); i++){
			//clipping normalの副作用が出るので moveToに変更
            var x = 0.5+Math.floor(latestX - i*bp);
			var y = 0.5+Math.floor(Math.round((dataAr[i][ix]-d)*coef+Yd))-1;
			if( i==0 || y<py0 && yx<py0 || y>py1 && yx>py1 ) //開始点と終了点が両方とも範囲外なら描画しない
				ctx.moveTo(x, y);
            else if(x<Chart.leftmostX || x>Chart.latestX)
                ctx.moveTo(x, y);
			else
				ctx.lineTo(x, y);
			yx = y;
		}
		ctx.stroke();
	},
    candle  : function (paneNum,dataAr) {
        if(!gCandleHeikinashi)  return;
		var ctx=this.ctx;
		var p = Chart.pane[paneNum];
		var bp= Chart.barPitch;
		var bw= Math.round(bp/2)*2;
        var lw = bw>4? 2: 1;
		var u = p.Mx;  var Yu = p.y0+p.topmgn;
		var d = p.Mn;  var Yd = p.y0+p.h-p.btmmgn;
		var coef = -(p.h-p.topmgn-p.btmmgn)/(u-d);
		ctx.beginPath();
		var plft = p.x0;
        var latestX=Chart.latestX;     //右端のバーのx座標
//		var prgt = p.x0+p.w;
        var prgt=Chart.latestX;     //右端のバーのx座標
        var plft=Chart.leftmostX;     //左端のバーのx座標
        
        //平均足モードなら元のcandleを消去
        if(gCandleHeikinashi) {
            for(var i=0; i<Math.min(dataAr.length,Chart.BARS); i++){
                var x = 0.5+Math.floor(latestX - i*bp);
                if(x<plft) continue;
                var h = dataAr[i][high_];
                var l = dataAr[i][low_];
                var yh = (h-d)*coef+Yd;
                var yl = (l-d)*coef+Yd;
                
                ctx.fillStyle = '#ffffff'; 
                Chart.fillRect(prgt-(i+1)*bp, yl+10, 2*bp, yh-yl-20);
            }
        }
		for(var i=0; i<Math.min(dataAr.length,Chart.BARS); i++){
            if(latestX - i*bp<plft) continue;
            var o, c;
            if(gCandleHeikinashi) {
                o = dataAr[i][haOpen_];
                c = dataAr[i][haClose_];	 
            }else{
                o = dataAr[i][open_];
                c = dataAr[i][close_];	 
            }
            var h = dataAr[i][high_];
            var l = dataAr[i][low_];
            var yo = (o-d)*coef+Yd;
            var yc = (c-d)*coef+Yd;
			var yh = (h-d)*coef+Yd;
			var yl = (l-d)*coef+Yd;

			var col;
			if(c>o) { ctx.fillStyle  = '#FF0000FF';  }
			else    { ctx.fillStyle  = '#0000CCFF';  }
            var x = Math.round(prgt-(i)*bp);
			Chart.fillRect(x, yl, lw, yh-yl);
			Chart.fillRect(x-bw/2, yc, bw, yo-yc);
//            			Chart.vline(prgt-i*bp, yh, yl-yh, col);
		}
		ctx.stroke();
	},
	
	histogram: function (paneNum,dataAr,close,color){
        var BARS    = Chart.BARS;    //バーの描画本数
        var latestX=Chart.latestX;     //右端のバーのx座標
        var bp        = Chart.barPitch ;      //バーの横軸方向のピッチ(自動計算される)
        var xleft     = Chart.gl;
		var ctx=this.ctx;
		var p = Chart.pane[paneNum];
		var bp= Chart.barPitch;
		var bw= Math.max(1,Math.floor(bp));
		var u = p.Mx;  var Yu = p.y0+p.topmgn;
		var d = p.Mn;  var Yd = p.y0+p.h-p.btmmgn;
		var coef = -(p.h-p.topmgn-p.btmmgn)/(u-d);
		ctx.beginPath();
		var plft = p.x0;
		var prgt = p.x0+p.w;
		ctx.fillStyle = color;
		for(var i=0; i<Math.min(dataAr.length,Chart.BARS); i++){
            var x = latestX - (i+0.5)*bp;
			ctx.fillRect(x, +Yd+(dataAr[i][close]-d)*coef, bw, -(dataAr[i][close]-d)*coef);
		}
		ctx.stroke();
	},
	bgcolor: function (paneNum,dataAr,idx, color){
        var BARS    = Chart.BARS;    //バーの描画本数
        var latestX=Chart.latestX;     //右端のバーのx座標
        var xleft     = Chart.gl;
		var ctx=this.ctx;
        var alpha = ctx.globalAlpha;
		ctx.globalAlpha = 0.35;
		var p = Chart.pane[paneNum];
		var bp= Chart.barPitch;
		var bw= Math.max(1,bp);
		var Yu = p.y0+p.topmgn;
		var Yd = p.y0+p.h-p.btmmgn;
		ctx.beginPath();
		var plft = p.x0;
		var prgt = p.x0+p.w;
		ctx.fillStyle = color;
		for(var i=0; i<Math.min(dataAr.length,Chart.BARS); i++){
			//clipping normalのだと副作用が出るので moveToに変更
            var x = latestX - i*bp;
			try{
				if( dataAr[i][idx]>0.5 )
					ctx.fillRect(x, Yu, bw, Yd-Yu );
			}catch{};
		}
		ctx.stroke();
		ctx.globalAlpha = alpha;
	}	
}
const plot = new _plot();
var Chart;

var gCandleAbsolute=false;
var gCandleHeikinashi= false;

function showSBChart(code) {
return new Promise(function(resolve) {
	if(code<1000) resolve();
	var chartType= "SB";
	var chart_url = getUrlOfSB(code);
	apndCanvas(code);
 	apndCanvasZ(code);	//zoomed
   
    //他で使用するため
    restore_gChartPerTerm();    //gChartPer,gChartTerm
    if( !db[gChartPer] )  db[gChartPer] = {};

    Chart = new _chart(code);		// rn がglobalで設定されていること
    db[gChartPer][code] = Chart;
    Chart.init(code);

    if(typeof(Alerts)=='string') Alerts={};
    if(Alerts[code]==undefined)
        Alerts[code] = {'al0':'', 'al1':'', 'al2':''};

    var stock = db[gChartPer];
	
	var img  = new Image();
	img.code = code;

	img.onload = function() {
        sleep(0);
		var code = img.code;
		//キャンバスを用意する
        var cw = img.width -20;	 //638-20 --> 618
        var ch  = img.height-67;	 //グラフ下の凡例領域67px分を読み込まない
		var canvas = document.getElementById(code);
        if(!canvas) return;  //canvas検出できなければ終了
 
		var ctx = canvas.getContext('2d');
		canvas.width  = cw;
		canvas.height = ch;
		ctx.drawImage( img, -20, 0 );		//キャンバスに画像の20pxから右を、読み込む

		// SBIの場合は、詳細チャートのURLの中で処理を行う
		var src = ctx.getImageData(0, 0, cw, ch);	   // 作業用
		var sd = src.data;

		var SC = db[gChartPer][code];
		SC.ctx = ctx;
		if( SC.randomStr 	!= gRandomStr
		   || SC.chartTerm  != gChartTerm
		   || SC.periodicity	!= gChartPer)
		{
			SC.randomStr 	= gRandomStr;
			SC.chartTerm     =gChartTerm;
			SC.periodicity     = gChartPer;
			reculc = true;
			//古いデータが表示されないように消去する
//			SC.RCI=[]; SC.MACD=[]; SC.MACDsig=[];
		}


		// 価格の桁数でグラフの横サイズが変わるので、　グラフのフレーム右端cfと、左端グリッドglと枠線位置grを検出
		SC.ctx = ctx;
		SC.cw = cw;	SC.ch = ch;
		SC.sd  = sd;
		//=============
		//枠線、グリッド位置検出
		//=============
        var cf, cf2, cf3;   //枠線の位置, frame 
		for(cf=cw-1; cf>400 && sd[(2*cw+cf)<<2]==255; cf--) ;	        //上から3pxの位置((2*cw+cf)<<2)を右端-1から、白でなくなるまでスキャン
		for(cf2=cw-1; cf2>400 && sd[(10*cw+cf2)<<2]==255; cf2--) ;	//上記で右端を検出できない場合への対応、11pxの位置
		for(cf3=cw-1; cf3>400 && sd[(18*cw+cf3)<<2]==255; cf3--) ;	//上記で右端を検出できない場合への対応、19pxの位置
		cf  = Math.min(cf,cf2,cf3);     //chart領域の右端、価格軸
        SC.cf = cf;	
		var gl, gr;           //グリッド位置、left  right
		for(gl=1;      gl<100 && sd[(2*cw+gl)<<2]==255; gl++)  //上から3pxの位置を1から、白でなくなるまでスキャン
		for(gr=cf-2;  gr>400 && sd[(2*cw+gr)<<2]==255; gr--) ;	//上から3pxの位置をcf-1から、白でなくなるまでスキャン
		SC.gl = gl;    SC.gr = gr;
		var g1u = SC.g1u;
		var g1d = SC.g1d;
		var g2u = SC.g2u;	// 100%
		var g2d = SC.g2d;	// 0%
// SC.drawText(530,15,cf,'red');
// SC.drawText(530,30,gr,'blue');
		//=============
		//価格軸のOCR---
		//=============
		SC.axPrc.u = -999999;
		for(var y=g1u; y<g1d; y++) {
			var x = cf+2;
			if( sd[(cw*y+x)<<2]<255) {	               //色が白でない==目盛りの場合
				while(sd[(cw*y+x)<<2]<255) x++; //目盛りがなくなるまで右に進んで
				var num = Number(ocrNum(sd, OCR_SBI, x, y, cw));
				if(SC.axPrc.u==-999999) {
					SC.axPrc.u   = num;
					SC.axPrc.Yu = y;
				}
				SC.axPrc.d   = num;
				SC.axPrc.Yd = y;
			}
		}
		//=============
		//インジ軸のOCR---
		//=============
		var numPrev = -99999;	//読み取り失敗時、それまでの読み取り値で推定する
		var delPrev = 0;
		SC.axInd.u = 100; SC.axInd.d = -100
		SC.axInd.Yu= -999999;
		for(var y=g2u; y<g2d; y++) {
			var x = cf+1;
			if( sd[(cw*y+x)<<2]<255) {	//色が白でない==目盛りの場合
				while(sd[(cw*y+x)<<2]<255) x++; //目盛りがなくなるまで右に進んで
				var num = Number(ocrNum(sd, OCR_SBI, x, y, cw));
				if(isNaN(num))
					num = numPrev - delPrev;
				else {
					if(SC.axInd.Yu==-999999) {
						if(gTechLO=="RCI")  num = 100;	// 時々 間違えるので強制的にセット
						SC.axInd.u   = num;
						SC.axInd.Yu = y;
					}
					delPrev = numPrev - num;
				}
				numPrev = num;
				SC.axInd.d   = num;
				SC.axInd.Yd = y;
			}
		}
		if(SC.axInd.u==SC.axInd.d){
			SC.axInd.u = 100;
			SC.axInd.d = -100;
		}
        //日付のOCR

		//================================================================
		// Chartの ディジタイズ 
		//================================================================
		//=============
		//　Candle読み取り  cfの値 bar本数、左端　右端
		//=============
		var perterm = $('#menuPerTerm').val();
        var adjust=0;   //bar位置補正、日中足5分では、前場後場の足の間に空白があるので補正する、readCandleは空白を読み飛ばす
        switch(perterm) {
                case '1,1':
                    adjust = 4;
                    break;
                case '5,1':
                    adjust = 1;
                    break;
                case '5,2':
                    adjust = 2;
                    break;
                case '5,3':
                    adjust = 3;
                    break;
        }                      
        Chart.tf = perterm.split(',')[0];
        var ar = barsParam[perterm][cf];

        if(!ar) resolve();  //Chartが存在しなかったら終了

        var BARS = ar[0]+adjust;
        var lft = ar[1];
        var rgt= ar[2];
        var Pitch  = (rgt-lft)/(BARS-1);
        Chart.barPitch = Pitch;
        Chart.BARS     = BARS;
        Chart.term      = BARS;
        Chart.leftmostX= barsParam[perterm][cf][1];

		SC.ohlc=[]; 
		readCandle(SC, sd, gr, gl, g1u, g1d, BARS, Pitch, rgt);
        readVolume(SC, sd, gr, gl, g2u, g2d, BARS, Pitch, rgt); 


		//=============
		//　Indictor読み取り
		//=============
		// if(gTechLO=="RCI"  && (reculc || SC.RCI.length==0)) {
			// readCurve(SC, sd, SC.RCI,      gr, gl, g2u, g2d, 153,    0);	//　%D SlowStoch Purple
			// interPolate(SC.ohlc.RCI, true);                 //ラインの欠落を補間する
			// while(SC.RCI[0]<-200)     SC.RCI.shift(); //pxを検出できなくて発生した異常値を削除する
			// var yp80  = Math.round((17*SC.axInd.Yu+  3*SC.axInd.Yd)/20);
			// var ym80 = Math.round((  3*SC.axInd.Yu+17*SC.axInd.Yd)/20);
			// hline(ctx, yp80, '#d0d0d0');
			// hline(ctx, ym80, '#d0d0d0');
		// }
		//================================================================
		// Chartの ディジタイズ 終了
		//================================================================
        // Grid消去
		eraseGrid(sd, cw, [10,   　5,cf-5,187], 0x99,0x99,0x99);  //sdを書き換えて　Gridを消去
		eraseGrid(sd, cw, [10, 205,cf-5,275], 0x99,0x99,0x99);  //sdを書き換えて　Gridを消去
        eraseRect(sd, cw, [0,200,cw,ch]);			//PerTermが、60,20 5,5 5,3　で真っ黒になるので消す
		if(perterm=='60,20' || perterm=='15,20' || perterm=='5,10' || perterm=='5,5' || perterm=='5,3')
			eraseRect(sd, cw, [5,273,cf-5,285]);			//PerTermが、60,20 5,5 5,3　で真っ黒になるので消す
		ctx.putImageData(src,0,0,0,0,cw,ch); //canvasに書き出す
        //-----キャンドルと出来高は標準で表示する---
        // pane0の設定
        var u   = SC.axPrc.u;
        var yu = SC.axPrc.Yu;
        var d   = SC.axPrc.d;
        var yd = SC.axPrc.Yd;
        var highest= d + (u-d)*(0-yd)/(yu-yd);
        var lowest = d + (u-d)*(190-yd)/(yu-yd);
        Chart.layout(0, 190, 1, Chart.BARS, lowest, highest);
        highest=0;
        //volume
        var ohlc = Chart.ohlc;
        for(var i=0; i<ohlc.length; i++){
            highest = ohlc[i][6]>=highest? ohlc[i][6]: highest; 
        }
//        Chart.layout(1, 35, 1, Chart.BARS,  0,highest);

        //平均足を常時計算
        heikin('','ha'); 
        
        if(typeof(preFunc)  !='undefined') preFunc();
        if(typeof(studyFunc)!='undefined') studyFunc();
        if(typeof(postFunc)  !='undefined') postFunc();

//        plot.histogram(1,ohlc,6,'#a0a0a0');	//[code,time,open,high,low,close,volume]の6番目

        //optionで平均足に書き換え
        if(gCandleHeikinashi)   plot.candle(0,ohlc); 
        if(typeof(plotFunc) !='undefined') plotFunc();  //

		//Alertの設定値を復元する
		var al = canvas.parentNode.getElementsByClassName('al');
		al[0].value = Alerts[code].al0;
		al[1].value = Alerts[code].al1;
		al[2].value = Alerts[code].al2;


		//---zoom chartTerm
		//zoomキャンバスを用意する
		var canvasZ = document.getElementById(code+'Z');
		var ctxZ = canvasZ.getContext('2d');
		canvasZ.width = Math.floor(($(window).width()-30)/gZoomRatio-2);	
		canvasZ.height = Math.floor(300/610*($(window).width()-30)/gZoomRatio+7);
		ctxZ.drawImage( canvas, 0, 0,canvasZ.width,canvasZ.height-5);		//キャンバスに画像を読み込む


        resolve();
        //semaphore = false;
	}	// end img.onload

	//img.src  = '6902.png';  
    img.src  = chart_url;
})
}


function test(adjust, L,R){
//    $("#reDraw").click();
    var perterm = $('#menuPerTerm').val();
    Chart.vline_(0,L+barsParam[perterm][Chart.cf][2] -Chart.barPitch*(barsParam[perterm][Chart.cf][0]-1),'blue',1);
    Chart.vline_(0,L+barsParam[perterm][Chart.cf][1],'green',1);
    Chart.vline_(0,R+barsParam[perterm][Chart.cf][2],'red',1);
}
//===================================================================
//===================================================================
// _chart.prototype = {
    // getCode: function () {
        // return this.code;
    // },
    // clearZone: function (n) {
		// var height = 6; if(n>=100) height=11; n=n%100;
		// if(gTechLO=="V" && n>10) n=4;	//Volumeの最小値が見えるように上に移動させる
        // this.ctx.fillStyle = '#FFFFFF';
        // this.ctx.fillRect(this.gl, this.g1d - 7 + 6 * n, this.latestX - this.gl + 5*this.barPitch, height);
        // return this;
    // },
    // fillZone: function (n, color, j) {
		// var height = 5; if(n>=100) height=10; n=n%100;
		// if(gTechLO=="V" && n>10) n=this.barPitch;	//Volumeの最小値が見えるように上に移動させる
        // this.ctx.fillStyle = color;
        // this.ctx.fillRect(this.latestX - j, this.g1d - 7 + 6 * n, this.barPitch, height);
        // return this;
    // }
// }

function ______chart_______(){};

function plotFunc_(paneNum,varIdx,color,width,vMin,vMax){
    var ohlc   = Chart.ohlc;    
	var highest=0, lowest=100000000;
	if(vMin==undefined && vMax==undefined){
		var imax = Math.min(Chart.BARS, ohlc.length);
		for(var i=0; i<imax; i++){
			highest = ohlc[i][varIdx]>=highest? ohlc[i][varIdx]: highest; 
			lowest  = ohlc[i][varIdx]<=lowest?  ohlc[i][varIdx]: lowest; 
		}
	} else {
		highest = vMax;	//座標系が上下反転のため
		lowest  = vMin;
	} 
	Chart.layout(paneNum, 35, 1, Chart.BARS, lowest, highest);
    plot.line(paneNum,Chart.ohlc,varIdx, color, width);
}
function histogramFunc_(paneNum,varIdx,color,width,vMin,vMax){
    var ohlc   = Chart.ohlc;    
	var highest=0, lowest=100000000;
	if(vMin==undefined && vMax==undefined){
		var imax = Math.min(Chart.BARS, ohlc.length);
		for(var i=0; i<imax; i++){
			highest = ohlc[i][varIdx]>=highest? ohlc[i][varIdx]: highest; 
			lowest  = ohlc[i][varIdx]<=lowest?  ohlc[i][varIdx]: lowest; 
		}
	} else {
		highest = vMax;	//座標系が上下反転のため
		lowest  = vMin;
	} 
	Chart.layout(paneNum, 35, 1, Chart.BARS, lowest, highest);
    plot.histogram(paneNum,Chart.ohlc ,varIdx,color);	
}

function prepSQL(code){
//	var Chart = new _chart;
    var ohlc   = Chart.ohlc;    
	try{
		if(typeof(studyFunc)!='undefined') studyFunc();
	}catch{
		console.log('studyFunc err: code= '+code);
	}
	try{
		if(typeof(postFunc)  !='undefined') postFunc();
	}catch{
		console.log('postFunc err: code= '+code);
	}
}

function bgcolorFunc_(paneNum,varIdx,color,paneHeight){
    if(!paneHeight)
        Chart.layout(paneNum, 35, 6);
    else
        Chart.layout(paneNum, paneHeight, 6);
    plot.bgcolor(paneNum,Chart.ohlc,varIdx,color);
}





//==================================
// PER PBR
//==================================
function showPBRChart(code,  isLast) {
	//document.title = 'PBR';
    if( !db[gChartPer][code] ) db[gChartPer][code] = {Color: "", checked: false};
    showPERPBRChart(code, getUrlOfPBR(code), isLast);
}
function showPERChart(code,  isLast) {
	//document.title = 'PER';
    if( !db[gChartPer][code] ) db[gChartPer][code] = {Color: "", checked: false};
    showPERPBRChart(code, getUrlOfPER(code), isLast);
}
function showPERPBRChart(code,  url, isLast) {
	//document.title = 'URI101'
	apndCanvas(code);
    if(!db[gChartPer][code]) {
        db[gChartPer][code]={Color:'', checked:false};
    }
	var img = new Image();
	img.code = code;
	img.onload = function() {
		var code = img.code;
		//キャンバスを用意する
		var canvas = document.getElementById(code);
		var ctx = canvas.getContext('2d');
		// canvas.width = img.width;
		// canvas.height = img.height;
		ctx.drawImage( img, 0, 0, img.width, img.height, 0, 0, canvas.width,canvas.height);		//キャンバスに画像を読み込む
		cw = canvas.width;
		ch = canvas.height;
	}
	img.src  = url;
}

//==================================
// 売上Chart
//==================================

function showURIChart(code,  isLast) {
	//document.title = 'URI101'
    if( !db[gChartPer][code] ) db[gChartPer][code] = {Color: "", checked: false};
    if( !stock[code] ) stock[code] = {Color: "", checked: false};
	apndCanvas(code);
    if(!stock[code]) {
        stock[code]={Color:'', checked:false};
    }

	var img = new Image();
	img.code = code;
	img.onload = function() {
		var code = img.code;
		//キャンバスを用意する
		var canvas = document.getElementById(code);
		var ctx = canvas.getContext('2d');
		// canvas.width = img.width;
		// canvas.height = img.height;
		ctx.drawImage( img, 0, 0, img.width, img.height, 0, 0, canvas.width/2,canvas.height);		//キャンバスに画像を読み込む
		cw = canvas.width;
		ch = canvas.height;
	}
	img.src  = getUrlOfURI101(code);

	var imgR = new Image();
	imgR.code = code;
	imgR.onload = function() {
		var code = imgR.code;
		//キャンバスを用意する
		var canvas = document.getElementById(code);
		var ctx = canvas.getContext('2d');
		// canvas.width = imgR.width;
		// canvas.height = imgR.height;
		ctx.drawImage( imgR, 0, 0, imgR.width, imgR.height, canvas.width/2, 0, canvas.width/2,canvas.height);		//キャンバスに画像を読み込む
		cw = canvas.width;
		ch = canvas.height;
	}
	imgR.src  = getUrlOfURI301(code);
}

function getUrlOfPBR(code) {
    var src = 'https://kabuyoho.ifis.co.jp/img/graph/pbr_range75/n/' + code + '.gif';
    return src;
}
function getUrlOfPER(code) {
    var src = 'https://kabuyoho.ifis.co.jp/img/graph/per_range75/n/' + code + '.gif';
    return src;
}
function getUrlOfURI101(code) {
    var src = 'http://www.ullet.com/' + code + 'ac101_200x140.png';
    return src;
}
function getUrlOfURI301(code) {
    var src = 'http://www.ullet.com/' + code + 'ac301_200x140.png';
    return src;
}

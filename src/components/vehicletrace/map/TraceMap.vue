<!--
	作者：masonchen
	时间：2017-07-07
	描述：查轨迹 > 地图组件
-->
<template>
	<div style="width:100%; height: 100%;">
		<baidu-map style="width:100%; height: 100%;" :center="mapCenter" :zoom="mapZoom" :scroll-wheel-zoom="enableScroll" @ready="onMapReady">
			<!--  缩放按钮    -->
			<bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{width:10,height:25}"></bm-navigation>
			<!--  比例尺    -->
			<bm-scale anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-scale>
		</baidu-map>
		<!--   菜单的打开及关闭状态的class分别为"map_ico ico_bg04 ico_close"和"map_ico ico_bg01 ico_menu" 更换class即可切换状态-->
		<div id="ico_pin" style="display:block">
			<p class="ico_pin_left">
				<a id="ico_2x" class="map_ico" :class="[isActive1?'ico_bg01' : 'ico_bg05']" href="javascript:void(0)" @click="setPlaySpeed(40)"><span>2X</span></a>
				<a id="ico_4x" class="map_ico" :class="[isActive2?'ico_bg01' : 'ico_bg05']" href="javascript:void(0)" @click="setPlaySpeed(20)"><span>4X</span></a>
				<a id="ico_8x" class="map_ico" :class="[isActive3?'ico_bg01' : 'ico_bg05']" href="javascript:void(0)" @click="setPlaySpeed(5)"><span>8X</span></a>
				<a class="map_ico ico_lock" :class="tailCheck" href="javascript:void(0)" @click="setTailCar()"><span></span></a>
			</p>
			<!--   顶部按钮开始   -->
			<!--   播放和暂停按钮 只显示一个   -->
			<p class="ico_pin_top">
				<a id="doCease" class="map_ico ico_bg01 ico_cease" href="javascript:void(0)" @click="doCeaseClick()"><span></span></a>
				<a v-if="playIcon" class="map_ico ico_bg05 ico_play" href="javascript:void(0)" @click="doDrawClick()"><span></span></a>
				<a v-if="!playIcon" class="map_ico ico_bg01 ico_stop" href="javascript:void(0)" @click="doStopClick()"><span></span></a>
			</p>
		</div>
	</div>
</template>
<script>
	let mapI, BMapI;
	import * as icons from 'static/const1'
	import {offLine,stop_N,stop_E,stop_S,stop_W,stop_WN,stop_WS,stop_EN,stop_ES,Run_E,Run_N,Run_W,Run_S,Run_WN,Run_WS,Run_EN,Run_ES} from 'static/const1.js'
	import {Mixin} from 'util/util1'
	
	export default {
		data() {
			return {
				mapCenter: {
					lng: 120.39,
					lat: 36.073
				},
				mapZoom: 15,
				enableScroll: true,

				// 地图轨迹绘制相关
				pointStart:'',				// 起点坐标
				gpsData:[],					// GPS信息总数组（包括坐标、速度等，并手动插入中间点信息）
				mapPoints:[],				// 轨迹点坐标（包括手动插入的中间点坐标）
				temPoints:[],				// GPS原始坐标数据（从后台传入的）
				multiple:15,				// 中间点个数
				
				// 顶部按钮相关
				isActive1:true,
		  		isActive2:false,
		  		isActive3:false,
  				tailCheck:'ico_bg07',
  				playIcon:true,				// 播放按钮
  				
  				// 轨迹播放相关
  				currentIndex:0,				// 含中间点的gps信息总数组的序列号
  				isPlaying:false,			// 是否正在播放
				tailcarflag:false,			// 是否根据车辆位置移动地图
				playSpeed:100,				// 车辆播放速度
				tailCar:false,				// 车辆位置是否始终位于中间
			}
		},
		props: ['gpsInfoList','routeLeave'],
		mixins:[Mixin],
		watch: {
			gpsInfoList(val){
				if(mapI){
					mapI.clearOverlays();
					this.gpsData = [];
					this.mapPoints = [];
					this.temPoints = [];
					this.currentIndex = 0;
				}
				
				this.doStopClick();
				this.loadTrace();				
			},
			routeLeave(val){
				if(val){
					this.doStopClick();
				}
			},
			currentIndex(val,oldVal){
				this.$emit('location-change',this.gpsData[val]);//初始化下方地址
			}
		},
		methods: {
			onMapReady(obj) {
				const { map, BMap } = obj;
				mapI = map;
				BMapI = BMap;
				mapI.setMapStyle({style:'grayscale'});
				this.loadTrace();
			},
			// 加载轨迹数据
			loadTrace(){
				const { gpsInfoList } = this;
				if(!mapI || !BMapI){
					return;
				}
				if(!gpsInfoList || !(gpsInfoList instanceof Array) || gpsInfoList.length == 0){
					return;
				}
				this.pointStart = new BMapI.Point(gpsInfoList[0].lngBd,gpsInfoList[0].latBd);

				this.addMarker(icons.BD_ICON,gpsInfoList[0],'起')//加载起点
				this.addMarker(icons.END_ICON,gpsInfoList[gpsInfoList.length - 1],'止')//加载终点
				this.addCarMarker(gpsInfoList[0],this.pointStart)//初始化车辆标识
				this.$emit('location-change',this.gpsInfoList[0]);//初始化下方地址
				const that = this;
				let add = function(){
					gpsInfoList.forEach((item, index) => {
						that.gpsData.push(item);
						if(item.lngBd && item.latBd){
							let point = new BMapI.Point(item.lngBd, item.latBd);
							that.mapPoints.push(point);
							that.temPoints.push(point);
							if(index == gpsInfoList.length - 1){//最后一个gps坐标点
								if(that.temPoints.length > 1){
									that.setPolylineColor(item.speed,that.temPoints);
									that.temPoints.splice(0,that.temPoints.length);
								}
								return;
							}
							if(gpsInfoList[index + 1].lngBd && gpsInfoList[index + 1].latBd){
								//根据速度画出轨迹线----轨迹按照速度区间分段--能不能形成线段，要判断当前点的下一个点
								that.drawPolyline(that.gpsInfoList[index],that.gpsInfoList[index + 1]);
								//以下条件不给相邻点添加中间点
								//1、两个点坐标相同。2、两个点速度均为0。3、两个点时间间隔小于5秒
								if((item.latBd == gpsInfoList[index + 1].latBd && item.lngBd == that.gpsInfoList[index + 1].lngBd)
										|| (that.gpsInfoList[index].speed == 0 && that.gpsInfoList[index+1].speed == 0)
										|| Date.parse(new Date(switchTime(that.gpsInfoList[index+1].gpsTime)))
												- Date.parse(new Date(switchTime(that.gpsInfoList[index].gpsTime))) < 5000) {
								} else {
									//画出中间点---扩充mapPoint 和 gpsData
									that.setBufferInfo(that.gpsInfoList[index],that.gpsInfoList[index+1])
								}
							}
						}
					})
				};
				add();
				mapI.setViewport(this.mapPoints);
			},
			
			//js调用的函数-------------------------------------------------------------------------------------------
			addMarker:function(picUrl,obj,word){//添加起点、终点标注
				var point = new BMapI.Point(obj.lngBd,obj.latBd)
				var myIcon = new BMapI.Icon(picUrl,new BMapI.Size(30,40),{anchor : new BMapI.Size(15, 35)});
				var marker = new BMapI.Marker(point,{icon:myIcon});
				var Label = new BMapI.Label('<p>' + word + ':' + switchTime(obj.gpsTime).substring(11) + '</p>');
				Label.setOffset(new BMapI.Size(-20,-25));
				marker.setLabel(Label);
				mapI.addOverlay(marker);
			},
			addCarMarker:function(gpsInfoList,points){//添加汽车图标标注
				var that = this;
				this.carIconName = this.getPicName(gpsInfoList)		
				this.carIcon = new BMapI.Icon(this.getPicUrl(that.carIconName),new BMap.Size(30,30));
				this.carIcon.setImageSize(new BMapI.Size(30,30));
				this.carMarker = new BMapI.Marker(points,{icon:this.carIcon});
				this.carLabel = new BMapI.Label('<p class="carlabel"><i>时\n'+ switchTime(gpsInfoList.gpsTime).substring(11,16) + ' | 速\n'
											   + gpsInfoList.speed + '\nkm</i><br/>'
											   + '<i>' + gpsInfoList.status + '</i></p>');
				this.carLabel.setOffset(new BMap.Size(35,-20));
				this.carLabel.setStyle({borderColor:'#000'});
				this.carMarker.setLabel(this.carLabel);
				mapI.addOverlay(this.carMarker);
			},
			drawPolyline:function(obj1,obj2){//根据速度画出轨迹线（用颜色区分不同速度下的轨迹线）
				var that = this;
				if(obj1.speed <= 60){//当速度小于60
					var oSpeed1 = parseInt(obj1.speed/20);
					var oSpeed2 = parseInt(obj2.speed/20);
					if(oSpeed1 != oSpeed2){//分别是20或40或60
						this.temPoints.push(new BMapI.Point(obj2.lngBd,obj2.latBd));
						this.setPolylineColor(obj1.speed,that.temPoints);
						this.temPoints.splice(0,this.temPoints.length)										
					}
				}else if(obj1.speed <= 120){				
					if(obj2.speed <= 60 || obj2.speed > 120){									
							this.temPoints.push(new BMapI.Point(obj2.lngBd,obj2.latBd));		
							this.setPolylineColor(obj1.speed,that.temPoints);
							this.temPoints.splice(0,this.temPoints.length);	
						}
									
				}else{
					if(obj2.speed <= 120){	
						console.log(obj2.lngBd)
						this.temPoints.push(new BMapI.Point(obj2.lngBd,obj2.latBd));
						this.setPolylineColor(obj1.speed,that.temPoint);
						this.temPoints.splice(0,this.temPoints.length);
					}
				}
			},
			setPolylineColor:function(startSpeed,points){//设置轨迹线颜色
				var _color20 = {strokeColor:"#0040FF", strokeWeight:6, strokeOpacity:0.8};
			    var _color40 ={strokeColor:"#31B404", strokeWeight:6, strokeOpacity:0.8};
			    var _color60 = {strokeColor:"#A5DF00", strokeWeight:6, strokeOpacity:0.8};
			    var _color120 = {strokeColor:"#FFBF00", strokeWeight:6, strokeOpacity:0.8};
			    var _color120max = {strokeColor:"#DF0101", strokeWeight:6, strokeOpacity:0.8};
			    var polyline;
		    	if(parseFloat(startSpeed) <= 20){
		    		polyline= new BMapI.Polyline(points, _color20);
		    	}else if(parseFloat(startSpeed) <= 40){
		    		polyline= new BMapI.Polyline(points, _color40);
		    	}else if(parseFloat(startSpeed) <= 60){
		    		polyline= new BMapI.Polyline(points, _color60);
		    	}else if(parseFloat(startSpeed) <= 120){
		    		polyline= new BMapI.Polyline(points, _color120);
		    	}else {
		    		polyline= new BMapI.Polyline(points, _color120max);
		    	}
				mapI.addOverlay(polyline);
			},
			setBufferInfo:function(obj1,obj2){
				var that = this;
				//生成中间点,然后将gpsData和mapPoint数组各自扩充（加入中间点信息）
				var bufferPoints = interp(obj1, obj2,that.multiple);
				for(var j = 0; j < bufferPoints.length; j++){
					var tempdate = obj1;			
					tempdate.lngBd = bufferPoints[j].lngBd;
					tempdate.latBd = bufferPoints[j].latBd;
					//如果初始点速度为0则设置中间点速度为结束点速度
					if(parseInt(tempdate.speed) == 0) {
						tempdate.speed =obj2.speed;
					}
					//如果初始点状态为‘停车’则设置中间点状态为‘行驶’,时间为结束点时间
					if(tempdate.status.indexOf('停车') >= 0) {
						tempdate.status = '行驶';
						tempdate.gpsTime = obj2.gpsTime;
						tempdate.directionName = obj2.directionName;
					}
					this.gpsData.push(tempdate);
					this.mapPoints.push(bufferPoints[j]);
				}
			},
			// 以下为轨迹播放相关 =================
			carMove:function(isPlay){//开始移动
				this.isPlaying = true;
				this.resetMkPoint()
			},
			resetMkPoint:function(){//让小车根据轨迹线跑起来--setPosition
				if(this.isPlaying == false){
					return;
				}
				if(!this.mapPoints[this.currentIndex]){
					this.isPlaying = false;
					this.currentIndex = 1;
					return;
				}
				var self = this;
				this.carMarker.setPosition(this.mapPoints[this.currentIndex]);//更新小车位置
				this.carLabel.setContent('<p class="carlabel"><i>时\n'+ switchTime(self.gpsData[self.currentIndex].gpsTime).substring(11,16) + ' | 速\n'
					+ this.gpsData[self.currentIndex].speed + '\nkm</i><br/>'
					+ '<i>' + this.gpsData[self.currentIndex].status + '</i></p>');//更改提示框内容
				this.carLabel.setOffset(new BMapI.Size(35,-20));								   
				this.carIconName = this.getPicName(self.gpsData[self.currentIndex]);
				this.carIcon.setImageUrl(this.getPicUrl(self.carIconName));//更改小车图片
				this.carMarker.setIcon(this.carIcon);
				this.carMarker.setLabel(this.carLabel);
				//车辆追踪（根据车辆位置移动地图）
				if(this.tailCar){
					if (!mapI.getBounds().containsPoint(this.mapPoints[this.currentIndex])) {//当前播放的坐标点在地图范围内
						mapI.panTo(this.mapPoints[this.currentIndex],{noAnimation:true});
				 	} 
				}
				if(this.currentIndex < this.mapPoints.length - 1){
					var j = 0;
					var curPlaySpeed = this.playSpeed;
					if(getCarState(self.gpsData[self.currentIndex]).indexOf('停车')>=0 
						|| getCarState(self.gpsData[self.currentIndex]).indexOf('离线')>=0){
						var curTime = Date.parse(new Date(switchTime(self.gpsData[self.currentIndex].gpsTime)));
						var nextTime = Date.parse(new Date(switchTime(self.gpsData[self.currentIndex + 1].gpsTime)));
						var stopTime = parseInt((nextTime-curTime)/60000);
						if(stopTime > 1){
							curPlaySpeed = this.playSpeed*stopTime;
							//停车时更新时间
							var interval = setInterval(function(){
								curTime += 60000;
								self.carLabel.setContent('<p class="carlabel"><i>时'
										   + (new Date(curTime).getHours()> 9 ? new Date(curTime).getHours():"0"+ new Date(curTime).getHours())
										   + ":"+ (new Date(curTime).getMinutes()> 9 ? new Date(curTime).getMinutes():"0"+ new Date(curTime).getMinutes())
										   + ' | 速'
										   + parseInt(self.gpsData[self.currentIndex].speed)+ 'km</i>'
										   + '<i>'+ getCarState(self.gpsData[self.currentIndex])+ '</i></p>'
								   	);
						   		self.carMarker.setLabel(self.carLabel);
						   		j++;
						   		if(j == stopTime){
						   			//清除当前定时任务
						   			clearInterval(interval);
									self.currentIndex ++;
									self.resetMkPoint();
						   		}
							}, this.playSpeed);
						}else{
							var self = this;
							setTimeout(function(){
								self.currentIndex ++;
								self.resetMkPoint();
							},curPlaySpeed)	
						}	
					}else{
						var self = this;
						setTimeout(function(){
							self.currentIndex ++;
							self.resetMkPoint();
						},curPlaySpeed)	
					}
				}else{
					this.i = 1;
					this.isPlaying = false;
					this.currentIndex = 0;
					this.doStopClick();
				}
			},
			// 以下为播放控制按钮相关 ===============
			doDrawClick:function(){
		  		this.playIcon = false;
		  		this.isPlaying = true;
		  		this.carMove();
		  	},
		  	doStopClick:function(){
		  		this.playIcon = true;
		  		this.isPlaying = false;
		  	},
		  	doCeaseClick:function(){
		  		this.playIcon = true;
		  		this.isPlaying = false;
				this.currentIndex = 0;
				this.carMarker.setPosition(this.pointStart)
				mapI.panTo(this.pointStart)//地图回到最初位置
		  	},
		  	setTailCar:function(){
		  		if(!this.tailCar){
		  			this.tailCheck = 'ico_bg06';
		  			this.tailCar = true;
		  		}else{
		  			this.tailCheck = 'ico_bg07';
		  			this.tailCar = false;
		  		}
		  	},
			setPlaySpeed:function(speed){
				this.playSpeed = speed;
		  		switch (speed){
		  			case 40:
		  				this.isActive1 = true;
		  				this.isActive2 = false;
		  				this.isActive3 = false;
		  				break;
		  			case 20:
		  				this.isActive2 = true;
		  				this.isActive1 = false;
		  				this.isActive3 = false;
		  				break;
		  			case 5:
		  				this.isActive3 = true;
		  				this.isActive1 = false;
		  				this.isActive2 = false;
		  				break;
		  		}
		  	}
		}
	}
	
	//转换后台所传时间的格式
	function switchTime(gpstime){
		return '20' + gpstime.substring(0,2)
					+ '-' + gpstime.substring(2,4)
					+ '-' + gpstime.substring(4,6)
					+ ' ' + gpstime.substring(6,8)
					+ ':' + gpstime.substring(8,10)
					+ ':' + gpstime.substring(10);
	}
	//插入中间坐标
	function interp(curdata, nextdata,multiple) {
		var _sMXY = new Array();
		var _sMX;
		var _sMY;
		// 将坐标转换为整数
		var iSx = parseFloat(curdata.lngBd);
		var iSy = parseFloat(curdata.latBd);
		var iDx = parseFloat(nextdata.lngBd);
		var iDy = parseFloat(nextdata.latBd);
		for (var i = 0; i < multiple; i++) {// 循环插值
		    var lng = (iSx + (iDx - iSx) / (multiple + 1) * (i + 1));
		    _sMX = "" + parseFloat((iSx + (iDx - iSx) / (multiple + 1) * (i + 1))).toFixed(5);// 计算x的插值
		    _sMY = "" + parseFloat((iSy + (iDy - iSy) / (multiple + 1) * (i + 1))).toFixed(5);// 计算y的插值
		    _sMXY.push(new BMap.Point(_sMX, _sMY));
		}
		return _sMXY;
	}
	//设置车辆状态
	function getCarState(data) {
		if(data.status.indexOf('离线') >= 0){
		    data.status = '离线';
		} else if(data.status.indexOf("行驶")>=0) {
		    var speed = data.speed;
			if(speed<5){
			    data.status = "停车";
			}else{
			    data.status = "行驶";
			}
		}
		return data.status;
	}

</script>
<style scoped>

.map_ico{  width:36px; height:36px; display: inline-block; border-radius:50px; text-align:center; margin:5px;}
.map_ico span {width:20px; height:20px; display: inline-block; background-size:100%; background-repeat:no-repeat; background-position:center center; margin-top:8px; line-height:20px; color:#FFF; vertical-align:top;}

.ico_pin_left{position:absolute; right:5px; top:60px; width:46px; }
.ico_pin_right{position:absolute; left:5px; top:60px; width:46px; }
.ico_pin_top{position:absolute; right:51px; top:60px; height:46px; text-align:right; }

.ico_bg01 { background: rgba(255,152,0,.80) ;}
.ico_bg05 { background: rgba(0,132,255,.80) ;}
.ico_bg06 { background: rgba(0,172,53,.80) ;}
.ico_bg07 { background: rgba(120,120,120,.80) ;}
.ico_lock span { background-image: url(../images/ico_3b.png); }
.ico_cease span { background-image: url(../images/ico_3c.png); }
.ico_play span { background-image: url(../images/ico_31.png); }
.ico_stop span { background-image: url(../images/ico_3a.png); }
</style>
mui.init({
	//返回上一页需要刷新上一页
	beforeback: function() {
		if(mui.os.plus) {
			//获得父页面的webview
			var list = plus.webview.currentWebview().opener();　
			//触发父页面的自定义事件(refresh),从而进行刷新
			mui.fire(list, 'refresh');
			//返回true,继续页面关闭逻辑
			return true;
		}
	}
});

var provinceId = '';
var cityId = '';
var areaId = '';

var userId = 1;
// var position=[1,0,1];
var position = [];
checkIsLogin();
if(localStorage.getItem('userId') && localStorage.getItem('userId') != '') {
	//获取用户信息
	userId = localStorage.getItem('userId');
}

var consigneeId = getQueryString('consigneeId');
console.log(consigneeId);

function mbSelectInit(position) {
	$.getJSON("../../region.json", function(data) {
		UplinkData = data.districtList[0].districtList;
		//        console.log(UplinkData);
		var mobileSelect5 = new MobileSelect({
			trigger: '#address',
			title: '选择',
			wheels: [{
				data: UplinkData
			}],
			transitionEnd: function(indexArr, data) {
				//滚动过程中的回调
				//                console.log(data);
			},
			callback: function(indexArr, data) {
				//点击确定回调
				console.log(indexArr);
				console.log(data);
				$('#address').val((data[0] || {}).value + "," + (data[1] || {}).value + "," + (data[2] || {}).value);
				provinceId = (data[0] || {}).id;
				cityId = (data[1] || {}).id;
				areaId = (data[2] || {}).id;
				console.log(provinceId, cityId, areaId);
			},
			position: position,
		});
	});
}

if(consigneeId && consigneeId != '') {
	//根据id查询
	$.ajax({
		url: rootPath + "/UserConsigneeApi/getAddressInfo?consigneeId=" + consigneeId,
		// type: 'POST',
		// data: {userId: userId},
		dataType: 'json',
		// async: false,
		success: function(data) {
			console.log(data);
			if(data.result == 'success') {

				$('#condigneeName').val(data.data.condigneeName);
				$('#telephone').val(data.data.telephone);
				$('#address').val(data.data.addressDetailedInfo);
				$('#liveAddress').val(data.data.liveAddress);
				if(data.position) {
					position = data.position;
					console.log(position);

					//初始化三级联动插件
					mbSelectInit(position);
				}
			} else {
				mui.alert('地址信息获取失败');
			}

		},
		error: function(err) {
			console.log(err);
		}
	});
} else {

}

function updateAddress() {

	var condigneeName = $('#condigneeName').val();
	var telephone = $('#telephone').val();
	var address = $('#address').val();
	var liveAddress = $('#liveAddress').val();

	if(condigneeName == '' || telephone == '' || address == '' || liveAddress == '') {
		mui.alert('参数不能为空');
		return;
	}

	//添加地址
	$.ajax({
		url: rootPath + "/UserConsigneeApi/updateShippingAddressapp",
		type: 'POST',
		data: {
			userId: userId,
			consigneeId: consigneeId,
			condigneeName: condigneeName,
			telephone: telephone,
			provinceId: provinceId,
			cityId: cityId,
			areaId: areaId,
			//详细地址字符串
			liveAddress: liveAddress,
			//省市区地址字符串
			addressDetailedInfo: address,
		},
		dataType: 'json',
		// async: false,
		success: function(data) {
			console.log(data);
			if(data.result == 'success') {
//console.log('opener',window.parent);
//window.parent.location.reload();
				mui.alert('修改成功', function() {
					//返回上一页并刷新上一页
						mui.back();
				});
			} else {
				mui.alert(data.msg);
			}
		},
		error: function(err) {
			console.log(err);
		}
	});
}
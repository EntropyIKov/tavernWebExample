'use strict';
var tavern = {
	signature : null,
	baseApiUrl : "https://tavern.epizy.com/api/",
	insertMessageHandler : null,
	previous_message_loading_handler: null,
	domain : null,
	senderName : null,
	user_id : null,
	master : null,
	auth_token : null,
	permission : null,
	last_message_id: null,
	count_of_messages_per_request: 20,
	defaultPeriod: 2000,
	scroll_to_bottom: false,
	all_messages_loaded: false,
	uloads: false,
	interval: null,

	init: function(initConfig) {
		this.insertMessageHandler = initConfig.insertMessageHandler;
		this.domain = initConfig.domain;
		this.senderName = initConfig.senderName;
		this.master = initConfig.master;
		this.signature = $('.tavern-chat').attr('signature');

		if(initConfig.scroll_to_bottom) this.scroll_to_bottom = initConfig.scroll_to_bottom;

		$.post(tavern.baseApiUrl, {
			"method": "checkPlatformUser",
			"domain": tavern.domain,
			"master_login": tavern.master,
			"name": tavern.senderName,
			"signature" : tavern.signature
		}, function(res) {
			if(res['status'] == 200) {
				tavern.auth_token = res['token'],
				tavern.permission = res['permission'],
				tavern.user_id = res['id'];
				tavern.getMessage();
				tavern.setPeriodNewMessageChecking();
			} 
		}, 'json');
	},

	sendMessage: function(msg) {
		$.post(tavern.baseApiUrl, {
			"auth_token" : tavern.auth_token,
			"domain": tavern.domain,
			"master_login": tavern.master,
			"method": "setMessage",
			"msg": msg, 
			"name": tavern.senderName,
			"permission" : tavern.permission,
			"platform_user_id" : tavern.user_id
		}, function (res) {
			if(res['status'] == 200) {
				var item = res['items'][0];
				tavern.insertMessageHandler(item['lastMsgId'], tavern.senderName, item['msg'], item['date'], tavern.scroll_to_bottom);
			}
		}, 'json');
	},

	deleteMessage: function(message_id, target_to_del) {
		tavern.pushInterval();
		$.post(tavern.baseApiUrl, {
			"method": "deleteMessage",
			"domain": tavern.domain,
			"master_login": tavern.master,
			"name": tavern.senderName,
			"message_id": message_id, 
			"auth_token" : tavern.auth_token,
			"permission" : tavern.permission,
			"platform_user_id" : tavern.user_id
		}, function (res) {
			if(res['status'] == 200) {
				$(target_to_del).remove();
			}
			tavern.popInterval();
		}, 'json');
	},

	pushInterval: function() {
		clearInterval(tavern.interval);
	},

	popInterval: function() {
		tavern.interval = setInterval(tavern.getMessage, tavern.perdiod);
	},

	getMessage: function(need_messages_from_position) {
		var needScroll = true;
		var body = {
			"method": "getMessage",
			"domain": tavern.domain,
			"master_login": tavern.master,
			"last_message_id": tavern.last_message_id,
			"count_of_messages_per_request": tavern.count_of_messages_per_request,
			"auth_token" : tavern.auth_token,
			"permission" : tavern.permission,
			"platform_user_id" : tavern.user_id
		};
		if(need_messages_from_position) {
			body.need_messages_from_position = need_messages_from_position;
			needScroll = false;
		}
		$.get(tavern.baseApiUrl, body, function (res) {
			if(res['status'] == 200) {
				if(res['its_all']) {
					tavern.all_messages_loaded = true;
				}
				tavern.unloads = true;
				res['items'].forEach(function(item, i, arr) {					
					if(!tavern.last_message_id || tavern.last_message_id > item['id']) {
						tavern.last_message_id = item['id'];
					}
					tavern.insertMessageHandler(item['id'], item['login'], item['text'], item['time'], needScroll);
				});
				tavern.unloads = false;
			}
		}, 'json');
	},

	setPeriodNewMessageChecking: function(perdiod) {
		if(!perdiod) perdiod = tavern.defaultPeriod;
		tavern.interval = setInterval(tavern.getMessage, perdiod);
	}
}
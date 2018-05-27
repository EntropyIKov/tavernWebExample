'use strict';
var oldScrollHeight;
var insertMessage = function(msgId, msgSenderName, msgContent, msgSendTime, needScrollToBot) {
	if($('.tavern-chat__message[message-id=' + msgId + ']').length != 0) return;
	var findUp = msgId < tavern.last_message_id;
	var msgList = $('.tavern-chat__message');
	if(!tavern.unloads) oldScrollHeight = $('.tavern-chat__content')[0].scrollHeight;
	var dt = new Date(msgSendTime);
	var deleteBtn = (tavern.permission == 'Moderator' || tavern.permission == 'Master') ? '<input type="button" value="Delete" class="delete-message">' : "";
	var body = $('\
		<li class="tavern-chat__message" message-id="' + msgId + '">\
			<span class="tavern-chat__message-sender-name">' + msgSenderName + '</span>\
			<div class="tavern-chat__message-content">' + msgContent + '</div>\
			<div class="tavern-chat__message-send-time">\
			' + dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString() + '\
			</div>\
			' + deleteBtn + '\
		</li>\
	');
	// $('.tavern-chat__content').append(body);
	var target;
	if(target = msgList.filter(function(msg_el_indx, msg_el) { return parseInt(msg_el.getAttribute('message-id')) > parseInt(msgId); })[0]) {
		body.insertBefore(target);	
	} else if((target = msgList.filter(function(msg_el_indx, msg_el) { return parseInt(msg_el.getAttribute('message-id')) < parseInt(msgId); })).lenght > 0) {
		target = target[target.lenght - 1];
		body.insertAfter(target);	
	} else {
		$('.tavern-chat__content').append(body);
	}

	if(tavern.all_messages_loaded) $('.tavern-chat_button-load-old-content').remove();

	if(needScrollToBot) {
		$('.tavern-chat__content').scrollTop($('.tavern-chat__content')[0].scrollHeight);
	} else {
		$('.tavern-chat__content').scrollTop($('.tavern-chat__content')[0].scrollHeight - oldScrollHeight);
	}
}

$(function() {
	oldScrollHeight = $('.tavern-chat__content')[0].scrollHeight;
	var crc = $(".tavern-chat").attr('crc');
	var domain = $(".tavern-chat").attr('domain');
	var senderName = $(".tavern-chat").attr('sender-name');
	var master = $(".tavern-chat").attr('master');
	var initConfig = {
		'crc' : crc,
		'insertMessageHandler' : insertMessage,
		'domain' : domain,
		'senderName' : senderName, 
		'master' : master,
		'scroll_to_bottom' : true
	};

	tavern.init(initConfig);
	
	var setEventListeners = function(){
		// Send Message
		$(".tavern-chat__button-send").on('click', function(e) {
			var msg = $(".tavern-chat__message-input");
			if(msg.val().length == 0) return;
			tavern.sendMessage(msg.val());
			msg.val('');
		});

		// Logout
		$(".tavern-chat__button-exit").on('click', function(e) {
			$.post(location.href, {
				'action': 'exit'
			}, function(res) {
				location.href = location.href;
			});
		});

		// Load previous messages
		$('.tavern-chat_button-load-old-content').on('click', function(e) {
			tavern.getMessage(tavern.last_message_id);
			if(tavern.all_messages_loaded) $('.tavern-chat_button-load-old-content').remove();
		})

		$('.tavern-chat__content').on('click', '.delete-message', function(e) {
			var target = e.target;
			var targetToDel = $(target).parents('.tavern-chat__message');
			var messageId = targetToDel.attr('message-id');
			tavern.deleteMessage(messageId, targetToDel);
		});
	}();
})

$.get('https://tavern.epizy.com/api/testapi.php', {
	'action': 'exit'
}, function(res) {
	console.log(res);
}, 'json');


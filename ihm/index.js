'use strict';

var SOCKET_URL = 'http://'+window.location.hostname;
var SOCKET_PORT = parseInt(window.location.port) + 1;

function SocketManager (logger) {
  this.socket = io(SOCKET_URL + ':' + SOCKET_PORT);

  this.socket.on('connect', function () {
    logger.info('Connected on port ' + SOCKET_PORT);
  });

  this.socket.on('connect_error', function () {
    logger.info('connected error ' + SOCKET_PORT);
  });

  return {
    sendMessage: function (message) {
      this.socket.send(message);
    }.bind(this),
    addReceivedMessageHandler: function (handler) {
      this.socket.on('message', handler);
    }.bind(this)
  }
};

var sessionId;
var socketManager = new SocketManager(console);

/* Dynamic IHM actions */

var buildQuickReplies = function (replies) {
  let html = '<ul class="quickReplies">';
  replies.forEach((value) => {
    html += '<li class="quickReply">' +
        '<a data-tag="' + value + '">' +
          value +
        '</a>' +
      '</li>';
  });
  html += '</ul>';
  return html;
};

var appendMessage = function (from, message, quickReplies) {
  const hasQuickReplies = quickReplies && quickReplies.length > 0;

  $('#chat-content .inner:first').append(
    '<div class="message">' +
      '<div class="inner ' + from + '">' +
         '<div class="text">' + message + '</div>' +
         (hasQuickReplies ? buildQuickReplies(quickReplies) : '') +
      '</div>' +
    '</div>'
  );

  if (hasQuickReplies) {
    $('.quickReplies a').each((index, reply) => {
      $(reply).on('click', (event) => {
        const tag = $(event.target).attr('data-tag');
        sendQuickReply(tag);
      });
    });
  }

  updateScroll();
};

var sendVisitorMessage = (message) => {
  const data = {
    message,
    sessionId
  };
  appendMessage('visitor', message);
  socketManager.sendMessage(data);
};

var sendQuickReply = (reply) => {
  sendVisitorMessage(reply);
  $('.quickReply').remove();
};

var updateScroll = () => {
  var element = $('#chat-content');
  element.scrollTop(element[0].scrollHeight);
};

$(document).ready(function () {

  socketManager.addReceivedMessageHandler(function (data) {
    sessionId = data.sessionId;

    if (data.type === 'message') {
      appendMessage('bot', data.message, data.quickReplies);
    }
  });

  $("#chat-input input").keyup(function (event) {
    // User press ENTER
    if(event.keyCode == 13) {
      const message = $("#chat-input input").val();
      sendVisitorMessage(message);
      $("#chat-input input").val("");
    }
  });
});

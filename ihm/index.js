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

var sendVisitorMessage = (messageDisplay, message) => {
  const data = {
    message,
    sessionId
  };
  appendMessage('visitor', messageDisplay);

  console.log(data);
  socketManager.sendMessage(data);
};

var sendQuickReply = (reply) => {
  sendVisitorMessage(reply, reply);
  $('.quickReply').remove();
};

var updateScroll = () => {
  var element = $('#chat-content');
  element.scrollTop(element[0].scrollHeight);
};

var strReplace = (str) => {
  let search = str.match(/(\d{1,2}\/\d{1,2}\/\d{4})+/g);
  let newString = str;
  if (search) {
    search.forEach((value, index) => {
      let date = moment.utc(search[index], 'DD/MM/YYYY');
      newString = newString.replace(search[index], date.format('L'));
    });
  }
  return newString;
};

$(document).ready(function () {
  const stringDate = "conversion rate for manomano on 13/12/2016 and 20/12/2016";
  let search = stringDate.match(/(\d{1,2}\/\d{1,2}\/\d{4})+/g);
  //console.log(search);
  let date = moment.utc(search[0],'DD/MM/YYYY');
  //console.log(date.format('L'));


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

      const messageFormated = strReplace(message);

      console.log(messageFormated); // Le 26/05/2011

      sendVisitorMessage(message, messageFormated);
      $("#chat-input input").val("");
    }
  });
});

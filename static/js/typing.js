var typing = (function () {
var exports = {};
// How long before we assume a client has gone away
// and expire its typing status
var TYPING_STARTED_EXPIRY_PERIOD = 15000; // 15s
// How frequently 'still typing' notifications are sent
// to extend the expiry
var TYPING_STARTED_SEND_FREQUENCY = 10000; // 10s
// How long after someone stops editing in the compose box
// do we send a 'stopped typing' notification
var TYPING_STOPPED_WAIT_PERIOD = 10000; // 10s

var users_currently_typing = [];

function send_typing_notification_ajax (recipients, operation) {
    channel.post({
        url: '/json/typing',
        data: {
            to: recipients,
            op: operation
        },
        success: function () {},
        error: function (xhr, error_type) {
            var response = channel.xhr_error_message("Error sending typing notification", xhr);
        }
    });
}

function check_and_send (operation) {
    if (operation === 'start') {
        if (compose.recipient() && compose.message_content()) {
            send_typing_notification_ajax(compose.recipient(), operation);
        }
    } else if (operation === 'stop') {
        if (compose.recipient()) {
            send_typing_notification_ajax(compose.recipient(), operation);
        }
    }
}

function check_and_send_start () {
    check_and_send('start');
}

function check_and_send_stop () {
    check_and_send('stop');
}

var throttled_start_notification = _.throttle(check_and_send_start,
  TYPING_STARTED_SEND_FREQUENCY,
  {trailing: false});
var debounced_stop_notification = _.debounce(check_and_send_stop, TYPING_STOPPED_WAIT_PERIOD);

$(document).on('compose_canceled.zulip', check_and_send_stop);
$(document).on('compose_finished.zulip', check_and_send_stop);
$(document).on('input', '#new_message_content', throttled_start_notification);
$(document).on('input', '#new_message_content', debounced_stop_notification);

function full_name (email) {
    return people.get_by_email(email).full_name;
}

function hide_notification (event) {
    $('#typing_notifications').find('[data-email="' + event.sender.email + '"]').remove();
    if (users_currently_typing.length === 1) {
        $('#typing_notifications').hide();
    }
    var i = users_currently_typing.indexOf(event.sender.user_id);
    users_currently_typing.splice(i);
}

var debounced_hide_notification = _.debounce(hide_notification, TYPING_STARTED_EXPIRY_PERIOD);

function display_notification (event) {
  // The typing notification is also sent to the user who is typing
  // In this case the notification is not displayed
  if (event.sender.user_id !== page_params.user_id) {
        var recipientsMatchingID = event.recipients.filter(function (recipient) {
            return recipient.user_id === page_params.user_id;
        });
        var userIsRecipient = recipientsMatchingID.length > 0;
        event.sender.name = full_name(event.sender.email);
        if (narrow.narrowed_to_pms() && userIsRecipient) {
            $('#typing_notifications').show();
            if ($('#typing_notifications').find('[data-email="' + event.sender.email + '"]').length === 0) {
                $('#typing_notifications ul').append(templates.render('typing_notification', event.sender));
                users_currently_typing.push(event.sender.user_id);
            }
            debounced_hide_notification(event);
        }
    }
}

exports = {
    display_notification: display_notification,
    hide_notification: hide_notification,
    send_stop_notification: debounced_stop_notification,
    send_start_notification: throttled_start_notification
};

return exports;
}());

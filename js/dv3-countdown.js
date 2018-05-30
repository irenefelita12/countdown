(function( $ ) {
  $.fn.countDown = function() {
    var plugin = $(this);

    var options = {};

    var defaults = {
      displayDays: false,
      displayHours: true
    };

    var startTime = Date.now(),
        nextTime = null,
        cWidth,
        subSec,
        diffTime,
        diffSec,
        timeRemaining,
        days,
        hours,
        minutes,
        seconds,
        method,
        j,
        num,  
        arg,
        interval;

    for (j = 0; j < arguments.length; j += 1) {
      arg = arguments[j];
      if (j === 0 && typeof arg === 'string') {
          method = arg;
      } else if (typeof arg === 'object') {
        if (typeof arg.getTime === 'function') {
            // arg is a Date object
            options.countDown = arg;
        } else {
            // arg is an options object
            options = $.extend(options, arg);
        }
      } else if (typeof arg === 'function') {
        // arg is callback
        options.callback = arg;
      } else {
        num = parseInt(arg, 10);
        // arg is seconds of timeout
        if (!isNaN(num)) {
            options.seconds = num;
        }
      }
    }

    // set time to countdown to
    if (options.countDown) {
      if (options.countDown.getTime()) {
          // set time as date object
          startTime = options.countDown.getTime();
          options.seconds = 0;
      }
    }

    plugin.init = function() {
      plugin.addClass('ctd-container');
      cWidth = plugin.width();
      var html = '';
      if(options.progressBar) {
        //bisa fromleft to right, vice versa, or reverse
        subSec = cWidth / options.seconds;
        var pWidth = options.progressReverse ? cWidth : 0;
        html += '<div class="ctd-progress-wrapper"><div class="ctd-progress-bar" style="width:' + pWidth + 'px;"></div></div>';
      }
      html += '<div class="ctd ctd-days">00</div>' +
              '<span class="ctd">:</span>' +
              '<div class="ctd ctd-hours">00</div>' +
              '<span class="ctd">:</span>' +
              '<div class="ctd ctd-minutes">00</div>' +
              '<span class="ctd">:</span>' +
              '<div class="ctd ctd-seconds">00</div>';
      plugin.append(html);
    }

    plugin.tick = function(firstLoad = false) {
      diffSec = options.seconds - (( $.now() - startTime) / 1000 | 0);
      var progressBarWidth = plugin.find(".ctd-progress-bar").width();
      timeRemaining = diffSec;
      
      days = parseInt(timeRemaining / 86400);
      timeRemaining = (timeRemaining % 86400);

      hours = parseInt(timeRemaining / 3600);
      timeRemaining = (timeRemaining % 3600);
      
      minutes = parseInt(timeRemaining / 60);
      timeRemaining = (timeRemaining % 60);
      
      seconds = parseInt(timeRemaining);

      days = days < 10 ? "0" + days : days;
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      plugin.find(".ctd-days").html(days);
      plugin.find(".ctd-hours").html(hours);
      plugin.find(".ctd-minutes").html(minutes);
      plugin.find(".ctd-seconds").html(seconds);
      if(options.progressReverse) {
        plugin.find(".ctd-progress-bar").animate({'width': cWidth - ((options.seconds - diffSec) * subSec) +'px'}, 800, 'linear');
      }
      else {
        plugin.find(".ctd-progress-bar").animate({'width': (options.seconds - diffSec) * subSec +'px'}, 800, 'linear');
      }

      if (diffSec <= 0) {
          clearInterval(interval);
          plugin.find(".ctd-days").html("00");
          plugin.find(".ctd-hours").html("00");
          plugin.find(".ctd-minutes").html("00");
          plugin.find(".ctd-seconds").html("00");
          if(options.callback) {
            setTimeout(function() {
              options.callback();
            }, 800);
          }
      }
    }

    plugin.init();
    // add one second so that the count down starts at the full seconds
    // example 05:00 not 04:59
    plugin.tick(true);
    if(diffSec>0) {
      interval = setInterval(plugin.tick, 1000);
    }
    
  }
}( jQuery ));
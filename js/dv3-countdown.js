(function( $ ) {
  $.fn.countDown = function() {
    var plugin = $(this);

    var options = {};

    var defaults = {
      displayDays: false,
      displayHours: true
    };

    const secInDays = 86400,
    secInHours = 3600,
    secInMins = 60;

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
        displayDays,
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
      diffSec = options.seconds - (( $.now() - startTime) / 1000 | 0);
    
      if(!options.displayDays && diffSec >= secInDays) {
        days = parseInt(diffSec / secInDays);
        displayDays = days.toString().length;
      }

      if(options.displayDays === 0 || options.displayDays) {
        displayDays = options.displayDays;
      }

      plugin.addClass('ctd-container');
      cWidth = plugin.width();
      var html = '';
      if(options.progressBar) {
        subSec = cWidth / options.seconds;
        // progress reverse means start from full bar to empty bar
        var pWidth = options.progressReverse ? cWidth : 0;
        html += '<div class="ctd-progress-wrapper"><div class="ctd-progress-bar" style="width:' + pWidth + 'px;"></div></div>';
      }

      dayHtml = displayDays ? '<div class="ctd ctd-days">00</div>' : '';
      html += dayHtml +
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

      if(displayDays) {
        days = parseInt(timeRemaining / secInDays);
        timeRemaining = (timeRemaining % secInDays);
        days = ("000" + days).slice(-(displayDays));
        plugin.find(".ctd-days").html(days);
      }
        
      hours = parseInt(timeRemaining / secInHours);
      timeRemaining = (timeRemaining % secInHours);
      hours = hours < 10 ? "0" + hours : hours;
      plugin.find(".ctd-hours").html(hours);
      
      minutes = parseInt(timeRemaining / secInMins);
      timeRemaining = (timeRemaining % secInMins);
      
      seconds = parseInt(timeRemaining);
         
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

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
# countdown
Simple countdown plugin

## Example
$("#time").countDown(4000, function() {
  alert('timeout')
});

$("#time").countDown(new Date("May 25 2018 20:25:01"), function() {
  alert("timeout");
});

$("#time").countDown({
  seconds: 1000,
  callback: function() {alert("timeouut")},
  progressBar: true
});


## Usage
$(<selection>).countDown([options]);

where **options** can be :

#### Object

Object with initial settings:
* callback: *function*, is called when countdown end, default null;
* seconds: *integer*, initial time in seconds for countdown timer, default 0;
* displayDays: *integer*, count of digits days to display, default auto;
* progressBar: *boolean*, whether progress bar is shown or not, default false;
* progressReverse: *boolean*, whether progress bar is displayed from empty bar to full bar or full bar to empty bar (reversed), default false;

#### Integer

```
$('#time').countDown(60)
// is identical to
$('#time').countdown({
    seconds: 60
});
```

#### Date object

```
$('#time').countDown(new Date("May 25 2018 20:25:01"));
// is identical to
$('#time').countDown({
    countdown: new Date("May 25 2018 20:25:01")
});
```

/* Testijuoksu2 - Running result statistics.
 * Karttalehtinen 2013
 * 
 * Dependencies: jQuery, Mustache.js, Moment.js
 */

var tj2 = {};

$(document).ready(function() {
  tj2.Functions.initialize();
});

/**
 * General functionality.
 */
tj2.Functions = function() {
  
  /*
   * Call this to start.
   */
  function initialize() {
    loadEventList();
    loadRunnerList();
    initializeEvents();
  }
  
  /**
   * Event listeners should be initialize here.
   */
  function initializeEvents() {
    $("#addRunnerButton").click(function() { addRunner(); });
    $("#addEventButton").click(function() { addEvent(); });
    $("#addResultButton").click(function() { addResult(); });
    $("#listAllResults").click(function() { tj2.Render.listAllResults(); return false; });
    $("#addResultsLink").click(function() { showResultAdd(); return false; });
    $("#closeForm").click(function() { hideResultAdd(); return false; });
    $("#showRecords").click(function() { tj2.Render.loadRecordsList(); return false; });

    $(".splitTimeInput").keypress(function(e) { splitTimeFormat(e); });

    $(document).ajaxError(function (e) {
      alert('Toiminto ei onnistunut');
      console.log(e);
    });
  }

  /**
   * Loads event list to both dropdown menus.
   */
  function loadEventList(){
    $.getJSON("service/testijuoksu2.php?query=eventlist", function(data){
      var events = {events: data};
      var html = Mustache.render($("#eventList").html(), events);
      $("#view").html(html);
      $("#addResultEvent").html(html);

      $("#view select").change(function(){ changeEvent(); });
    });
  }

  function changeEvent(){
    tj2.Render.loadEventResults($("#view select").val());
  }

  /**
   * Loads runner list to both dropdown menus.
   */
  function loadRunnerList(){
    $.getJSON("service/testijuoksu2.php?query=runners", function(data){
      var runners = {runners: data};
      var html = Mustache.render($("#runnerList").html(), runners);
      $("#runners").html(html);
      $("#addResultRunner").html(html);

      $("#runners select").change(function(){ changeRunner(); });
    });
  }

  function changeRunner(){
    tj2.Render.loadRunnerResults($("#runners select").val());
  }

  function addRunner() {
    var runner = {
      name: $("#runnerName").val(),
      sex: $("#runnerSex").val(),
      password: $("#password").val()
    };

    // Clear value
    $("#runnerName").val("");

    if(runner.name != ""){
      $.post("service/testijuoksu2.php?query=addRunner", runner, function(response){
        $("#statusText").html(response.name + " lisätty kantaan");
        loadRunnerList();
      });
    }
  }

  /**
   * Add new event date.
   */
  function addEvent(){
    if($("#eventDate").val() == ""){
      return;
    }

    var arr = $("#eventDate").val().split(".");
    var day = arr[2] + "-" + arr[1] + "-" + arr[0];

    var post = {day: day, password: $("#password").val()};

    $.post("service/testijuoksu2.php?query=addEvent", post, function(response){
      $("#statusTextEvent").html(day + " lisätty kantaan");
      loadEventList();
    });

    // Clear value
    $("#eventDate").val("");
  }

  function addResult() {
    var result = {
      runner: $("#addResultRunner select").val(),
      event: $("#addResultEvent select").val(),
      split1: $("#split1").val(),
      split2: $("#split2").val(),
      split3: $("#split3").val(),
      split4: $("#split4").val(),
      password: $("#password").val()
    };

    // If times are given in cumulative form, do handling here
    if($("#cumulativeTimes").is(":checked") && result.split2 != ""){ // Don't handle one lap situation
      // TODO: Refactor this shit!
      result.split1 = moment(result.split1, "mm:ss");
      result.split2 = moment(result.split2, "mm:ss");
      result.split3 = moment(result.split3, "mm:ss");
      result.split4 = moment(result.split4, "mm:ss");

      result.split2 = result.split2.subtract('minutes', result.split1.minutes()).subtract('seconds', result.split1.seconds());
      if(result.split3 != null)
        result.split3 = result.split3.subtract('minutes', result.split2.minutes()).subtract('seconds', result.split2.seconds());
      if(result.split4 != null)
        result.split4 = result.split4.subtract('minutes', result.split3.minutes()).subtract('seconds', result.split3.seconds());

      result.split1 = result.split1.format("mm:ss");
      if(result.split2 != null)
        result.split2 = result.split2.format("mm:ss");
      else
        result.split2 = "";
      if(result.split3 != null)
        result.split3 = result.split3.format("mm:ss");
      else
        result.split3 = "";
      if(result.split4 != null)
       result.split4 = result.split4.format("mm:ss");
      else
       result.split4 = "";
    }

    if($("#split1").val() == "" || result.event == "" || result.runner == "")
      return;

    var data = {data : JSON.stringify(result)};

    $.post("service/testijuoksu2.php?query=addResult", data, function(){
      $("#statusTextResult").html("Tulos lisätty");
      $("#addResultRunner select").val("");
      //$("#addResultEvent select").val("");
      $("#split1").val("");
      $("#split2").val("");
      $("#split3").val("");
      $("#split4").val("");

      tj2.Render.loadEventResults($("#view select").val());
    });
  }

  /**
   * Helper for adding split times. Adds ':' between minutes and seconds.
   * @param {Event} event 
   */
  function splitTimeFormat(event){
    if(event.target.value.length == 2 && event.keyCode != 8){
      event.target.value += ':';
    }
  }

  function showResultAdd() {
    $("#forms").slideDown();
  }

  function hideResultAdd() {
    $("#forms").slideUp();
  }
  
  return {
    initialize: initialize
  };
}();


/**
 * Result rendering functions.
 */
tj2.Render = function(){
  
  /**
   * Shows result for event.
   * @param {type} eventId
   */
  function loadEventResults(eventId){
    $.getJSON("service/testijuoksu2.php?query=eventresults&eventId=" + eventId, function(data){
      renderResults(data, $("#eventResults"), true);
    });
  }

  /**
   * Show result for runner.
   * @param {type} runnerId
   */
  function loadRunnerResults(runnerId){
    $.getJSON("service/testijuoksu2.php?query=runner&runnerId=" + runnerId, function(data){
      renderResults(data, $("#runnerResults"), false);
    });
  }
  
  /**
   * Shows records page.
   */
  function loadRecordsList() {
    $.getJSON("service/testijuoksu2.php?query=getRecords", function(data) {
      var html = Mustache.render($("#records").html(), data);
      $("#results").html(html);
    });
  }

  /**
   * Shows all results.
   */
  function listAllResults() {
    $.getJSON("service/testijuoksu2.php?query=allResults", function(data){
      renderResults(data, $("#allResults"), false);
    });
  }

  /**
   * Render result table from given data to selected template.
   * Parses man and women separate lists, if asked.
   * @param {type} data Result data
   * @param {type} $template Template to render as jQuery object
   * @param {boolean} split True if different results for man and women.
   * @returns {undefined}
   */
  function renderResults(data, $template, split) {
    var result = {};

    if(split) {
      var man = [];
      var women = [];

      for(var i = 0; i < data.length; i++){
        if(data[i].sex == 'M')
          man.push(data[i]);
        else
          women.push(data[i]);
      }
      result = {man: man, women: women};
    } else {
      result = {results: data};
    }

    var html = Mustache.render($template.html(), result);
    $("#results").html(html);
  }
  
  return {
    loadEventResults: loadEventResults,
    loadRunnerResults: loadRunnerResults,
    loadRecordsList: loadRecordsList,
    listAllResults: listAllResults
  };
  
}();
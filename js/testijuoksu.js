$(document).ready(function() {
  loadEventList();
  loadRunnerList();
  
  $("#addRunnerButton").click(function() { addRunner(); });
  $("#addEventButton").click(function() { addEvent(); });
  $("#addResultButton").click(function() { addResult(); });
});

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
  loadEventResults($("#view select").val());
}

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
  loadRunnerResults($("#runners select").val());
}

function loadEventResults(id){
  $.getJSON("service/testijuoksu2.php?query=eventresults&eventId=" + id, function(data){
    var result = {results: data};
    var html = Mustache.render($("#eventResults").html(), result);
    $("#results").html(html);
  });
}

function loadRunnerResults(id){
  $.getJSON("service/testijuoksu2.php?query=runner&runnerId=" + id, function(data){
    var result = {results: data};
    var html = Mustache.render($("#runnerResults").html(), result);
    $("#results").html(html);
  });
}

function addRunner() {
  var runner = {
    name: $("#runnerName").val(),
    sex: $("#runnerSex").val()
  };
  
  // Clear value
  $("#runnerName").val("");
  
  if(runner.name != ""){
    $.post("service/testijuoksu2.php?query=addRunner", runner, function(response){
      var res = JSON.parse(response);
      $("#statusText").html(res.name + " lisätty kantaan");
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
  
  var post = {day: day};
  
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
    split4: $("#split4").val()
  };
  
  if($("#split1").val() == "")
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
    
    $("#view select").val('');
    $("#view select").val(result.event);
  });
}
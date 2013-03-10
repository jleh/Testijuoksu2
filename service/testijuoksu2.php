<?php
/**
 * Simple JSON server for running database.
 */

header('Content-type: application/json');

$param = $_REQUEST['query'];

if($param == "eventlist")
    event_list();
if($param == "eventresults")
    list_results($_REQUEST['eventId']);
if($param == "runners")
    list_runners();
if($param == "runner")
    list_runner_times($_REQUEST['runnerId']);
if($param == "allResults")
    list_all_results();
if($param == "getRecords")
    get_records();

// Edit calls
if(isset($_REQUEST['password'])){
    if(!checkPassword($_REQUEST['password']))
        die("Authentication failure");
    
    if($param == "addRunner")
        add_runner($_REQUEST['name'], $_REQUEST['sex']);
    if($param == "addEvent")
        add_event($_REQUEST['day']);
    if($param == "addResult")
        add_result($_REQUEST['data']);
}

/**
 * Checks that password is correct.
 * @param type $pass
 * @return boolean
 */
function checkPassword($pass) {
    include('yhteys.php');
    $sql = "SELECT value FROM testijuoksu2_options WHERE testijuoksu2_options.option = 'password'";
    $query = $yhteys->prepare($sql);
    $query->execute();
    
    $correct = $query->fetch();
    
    if($correct[0] == $pass){
        return true;
    } else {
        return false;
    }
}

/**
 * Lists all events from newest to oldest.
 */
function event_list(){
    include('yhteys.php');

    $sql = "SELECT id, event_date AS compare, DATE_FORMAT( event_date, '%d.%m.%Y' ) AS event_date 
            FROM testijuoksu2_event ORDER BY compare DESC";
    $query = $yhteys->prepare($sql);
    $query->execute();
    
    $list;
    while($row = $query->fetch()){
        $list[] = $row;
    }
    
    echo json_encode($list);
}

/**
 * List results for event by given id.
 * Results are sorted by descending rounds and time.
 * @param type $event_id
 */
function list_results($event_id){
    include('yhteys.php');

    // Select all runners from event
    $sql = "SELECT SUM( TIME_TO_SEC( split_time ) ) AS time , SUM(split_number) AS roundSum, runner, name, sex
            FROM  testijuoksu2_split 
            LEFT JOIN testijuoksu2_runner ON testijuoksu2_split.runner=testijuoksu2_runner.id
            WHERE event = ?
            GROUP BY runner
            ORDER BY roundSum DESC, time ASC";
    $query = $yhteys->prepare($sql);
    $query->execute(array($event_id));
    
    $list = array();
    while($row = $query->fetch()){
        $runner_id = $row['runner'];
        $runner_name = $row['name'];
        $sex = $row['sex'];
        $total_time = gmdate("i:s", $row['time']);
        
        $sql = "SELECT split_number, TIME_TO_SEC( split_time ) AS split_time 
                FROM testijuoksu2_split WHERE runner = ? AND event = ?";
        $query2 = $yhteys->prepare($sql);
        $query2->execute(array($runner_id, $event_id));
        
        $splits = array();
        while($row2 = $query2->fetch()){
            $splits[] = array("round" => $row2['split_number'],
                              "time" => gmdate("i:s", $row2['split_time']));
        }
        
        $list[] = array(
            "name" => $runner_name,
            "sex" =>  $sex,
            "total_time" => $total_time,
            "total_time_sec" => $row['time'],
            "splits" => $splits,
            "pace" => gmdate("i:s", (int)($row['time'] / (count($splits)*(2.57))))
        );
    }
    
    echo json_encode($list);
}

function list_runners() {
    include('yhteys.php');

    $sql = "SELECT * FROM testijuoksu2_runner ORDER BY name";
    $query = $yhteys->prepare($sql);
    $query->execute();
    
    $list = array();
    while($row = $query->fetch()){
        $list[] = array(
            "name" => $row['name'],
            "id" => $row['id'],
        );
    }
    
    echo json_encode($list);
}

function add_runner($name, $sex){
    include('yhteys.php');
    
    $sql = "INSERT INTO testijuoksu2_runner (name, sex) VALUES(?, ?)";
    $query = $yhteys->prepare($sql);
    $query->execute(array($name, $sex));
    
    echo json_encode(array(
        "name" => $name
    ));
}

function add_event($day) {
    include('yhteys.php');
    
    $sql = "INSERT INTO testijuoksu2_event (event_date) VALUES(?)";
    $query = $yhteys->prepare($sql);
    $query->execute(array($day));
    
    echo json_encode(array(
        "day" => $day
    ));
}

function add_result($data){
    $result = json_decode(str_replace('\"', '"', $data));
    $runner = $result->runner;
    $event = $result->event;
    
    add_split($runner, $event, 1, "00:".$result->split1);
    
    if($result->split2 != ""){
        add_split($runner, $event, 2, "00:".$result->split2);
    }
    if($result->split3 != ""){
        add_split($runner, $event, 3, "00:".$result->split3);
    }
    if($result->split4 != ""){
        add_split($runner, $event, 4, "00:".$result->split4);
    }
    
    echo json_encode(array("ok" => "ok"));
}

function add_split($runner, $event, $splitn, $time) {
    include('yhteys.php');
    
    $sql = "INSERT INTO testijuoksu2_split (event, runner, split_number, split_time) VALUES(?, ?, ?, ?)";
    $query = $yhteys->prepare($sql);
    $query->execute(array($event, $runner, $splitn, $time));
}

function list_runner_times($runner_id){
    include('yhteys.php');

    // Select all runners from event
    $sql = "SELECT SUM( TIME_TO_SEC( split_time ) ) AS time , SUM(split_number) AS roundSum, 
            runner, name, sex, event, event_date, DATE_FORMAT(event_date, '%d.%m.%Y') AS event_date_formatted
            FROM  testijuoksu2_split 
            LEFT JOIN testijuoksu2_runner ON testijuoksu2_split.runner=testijuoksu2_runner.id
            LEFT JOIN testijuoksu2_event ON testijuoksu2_split.event=testijuoksu2_event.id
            WHERE runner = ?
            GROUP BY event
            ORDER BY event_date desc";
    $query = $yhteys->prepare($sql);
    $query->execute(array($runner_id));
    
    $list = array();
    while($row = $query->fetch()){
        $runner_name = $row['name'];
        $sex = $row['sex'];
        $total_time = gmdate("i:s", $row['time']);
        
        $sql = "SELECT split_number, TIME_TO_SEC( split_time ) AS split_time FROM testijuoksu2_split WHERE runner = ? AND event = ?";
        $query2 = $yhteys->prepare($sql);
        $query2->execute(array($runner_id, $row['event']));
        
        $splits = array();
        while($row2 = $query2->fetch()){
            $splits[] = array("round" => $row2['split_number'],
                              "time" => gmdate("i:s", $row2['split_time']));
        }
        
        $list[] = array(
            "event" => $row['event_date_formatted'],
            "time_in_sec" => $row['time'],
            "total_time" => $total_time,
            "splits" => $splits,
            "pace" => gmdate("i:s", (int)($row['time'] / (count($splits)*(2.57))))
        );
    }
    
    echo json_encode($list);
}

/**
 * Lists results  from all events.
 * @param type $event_id
 */
function list_all_results(){
    include('yhteys.php');

    // Select all runners from event
    $sql = "SELECT SUM( TIME_TO_SEC( split_time ) ) AS time , SUM(split_number) AS roundSum, 
            runner, name, sex, event, event_date, DATE_FORMAT(event_date, '%d.%m.%Y') AS event_date_formatted
            FROM  testijuoksu2_split 
            LEFT JOIN testijuoksu2_runner ON testijuoksu2_split.runner=testijuoksu2_runner.id
            LEFT JOIN testijuoksu2_event ON testijuoksu2_split.event=testijuoksu2_event.id
            GROUP BY runner
            ORDER BY event_date DESC, roundSum DESC, time DESC";
    $query = $yhteys->prepare($sql);
    $query->execute(array($event_id));
    
    $list = array();
    while($row = $query->fetch()){
        $runner_id = $row['runner'];
        $runner_name = $row['name'];
        $event_id = $row['event'];
        $sex = $row['sex'];
        $total_time = gmdate("i:s", $row['time']);
        
        $sql = "SELECT split_number, TIME_TO_SEC( split_time ) AS split_time 
                FROM testijuoksu2_split WHERE runner = ? AND event = ?";
        $query2 = $yhteys->prepare($sql);
        $query2->execute(array($runner_id, $event_id));
        
        $splits = array();
        while($row2 = $query2->fetch()){
            $splits[] = array("round" => $row2['split_number'],
                              "time" => gmdate("i:s", $row2['split_time']));
        }
        
        $list[] = array(
            "event" => $row['event_date_formatted'],
            "name" => $runner_name,
            "sex" =>  $sex,
            "total_time" => $total_time,
            "total_time_sec" => $row['time'],
            "splits" => $splits,
            "pace" => gmdate("i:s", (int)($row['time'] / (count($splits)*(2.57))))
        );
    }
    
    echo json_encode($list);
}

function get_records() {
    
}
?>
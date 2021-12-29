<?php

// this script is @deprecated no need to use it

// for troubleshooting
// $hd = fopen(__DIR__."/log.txt", "a");
// fwrite($hd, print_r($_REQUEST, 1));
// fclose($hd);

require_once '../dompdf/autoload.inc.php';

use Dompdf\Dompdf;

$client_endpoint = isset($_REQUEST['auth']) && isset($_REQUEST['auth']['client_endpoint']) ? $_REQUEST['auth']['client_endpoint'] : null;
$access_token = isset($_REQUEST['auth']) && isset($_REQUEST['auth']['access_token']) ? $_REQUEST['auth']['access_token'] : null;
$event_token = isset($_REQUEST['event_token']) ? $_REQUEST['event_token'] : null;

$doc_id = isset($_REQUEST['properties']) && isset($_REQUEST['properties']['ID']) ? $_REQUEST['properties']['ID'] : null;
$doc_create = isset($_REQUEST['properties']) && isset($_REQUEST['properties']['DATE_CREATE']) ? $_REQUEST['properties']['DATE_CREATE'] : null;
$doc_executor = null;
if (isset($_REQUEST['properties']) && isset($_REQUEST['properties']['ispolnitel'])) {
    $executors = [];
	foreach($_REQUEST['properties']['ispolnitel'] as $key => $value) {
		$executors[] = $value;
	}
	$doc_executor = implode(', ', $executors);
}
$doc_object = isset($_REQUEST['properties']) && isset($_REQUEST['properties']['ISTOCHNIK']) ? $_REQUEST['properties']['ISTOCHNIK'] : null;
$doc_description = null;
if (isset($_REQUEST['properties']) && isset($_REQUEST['properties']['PREVIEW_TEXT'])) {
	$descriptions = [];
	foreach($_REQUEST['properties']['PREVIEW_TEXT'] as $key => $value) {
		$descriptions[] = $value;
	}
	$doc_description = implode(', ', $descriptions);
}

function executeHTTPRequest ($queryUrl, $params = []) {
    $result = [];
    $queryData = http_build_query($params);

    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_SSL_VERIFYPEER => 0,
        CURLOPT_POST => 1,
        CURLOPT_HEADER => 0,
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_URL => $queryUrl,
        CURLOPT_POSTFIELDS => $queryData,
    ]);

    $curlResult = curl_exec($curl);
    curl_close($curl);

    if ($curlResult != '') $result = json_decode($curlResult, true);

    return $result;
}

function executeREST ($rest_url, $method, $params, $access_token) {
    $url = $rest_url.$method.'.json';
    return executeHTTPRequest($url, array_merge($params, ["auth" => $access_token]));
}

if ($access_token && $client_endpoint && $doc_id) {
	$dompdf = new DOMPDF();
	$dompdf->set_paper("A4", 'landscape');
	$html = '<html>
	  <head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<style>
		  body {
			font-family: DejaVu Sans;
		  }
		  table {
			border-collapse: collapse;
			margin: 1% auto;
			width: 98%;
		  }
		  td, th {
			padding: 3px;
			border: 1px solid black;
		  }
		</style>
	  </head>
	 <body>
	  <div style="text-align: center">
		<p style="font-size: 18px; margin-bottom: 5px; margin-top: 5px"><b>ЗАКАЗ-НАРЯД</b></p>
		<p style="font-size: 18px; margin-bottom: 5px; margin-top: 5px"><b>на производство работ</b></p>
		<p style="font-size: 14px; margin-bottom: 5px; margin-top: 5px">должность, ФИО специалиста <i style="text-decoration: underline">' . $doc_executor . '</i></p>
		<p style="font-size: 14px; margin-bottom: 5px; margin-top: 5px">За смену с ___ до ___ часов « ___ » __________ ______ г.</p>
	  </div>
	  <table>
		<thead>
		  <tr>
			<th style="width: 100px"></th>
			<th style="width: 200px">Дата поступления задания</th>
			<th>Объект</th>
			<th>Задание (подробное описание)</th>
			<th>Подпись и ФИО принявшего работу</th>
			<th>Комментарий по выполнению заявки</th>
		  </tr>
		</thead>
		<tbody>
		  <tr>
			<td style="width: 100px">' . $doc_id . '</td>
			<td style="width: 200px">' . $doc_create . '</td>
			<td>' . $doc_object . '</td>
			<td>' . $doc_description . '</td>
			<td></td>
			<td></td>
		  </tr>
		</tbody>
	  </table>
	 </body>
	</html>';
	$dompdf->load_html($html);
	$dompdf->render();
	$output = $dompdf->output();
	file_put_contents('./files/' . $doc_id . '.pdf', $output);
	
    $response = executeREST($client_endpoint,'bizproc.event.send', [
		"EVENT_TOKEN" => $event_token,
		"RETURN_VALUES" => [
			'file_url' => 'https://app.evgenybelkin.ru/bp-make-pdf/files/' . $doc_id . '.pdf',	
		],
		"LOG_MESSAGE"=>'OK'
	], $access_token);
}
?>

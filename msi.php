<?php 
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Access-Control-Allow-Origin: *');
$domain = '';
if(isset($_POST['msi_sender_name']) && !empty($_POST['msi_sender_name']))
{
	$_SESSION['msi_sender_name'] = $_POST['msi_sender_name'];
	$senderName = $_SESSION['msi_sender_name'];
} else {
	$senderName = 'exampleUser';
}

if(isset($_POST['action']) && $_POST['action'] == 'exit') 
{
	$_SESSION['msi_sender_name'] = '';
	$_SESSION['msi_domain'] = '';
	unset($_SESSION['msi_sender_name']);
	unset($_SESSION['msi_domain']);
}

$domain.= 'msi';
$key = [
	'msi' => '804122be236d91b42ae387329d716408'
	];
$masterLogin = 'msi77';
$signature = signatureGen($masterLogin, $domain, $key[$domain]);
function signatureGen($master, $domain, $key)
{
	return md5($domain.$master.$key);
}

?>

<script src='jquery-3.3.1.min.js'></script>
<link rel="stylesheet" href='web-example.css'>

<?php if(isset($_SESSION['msi_sender_name'])):?>
<script src='tavern.js'></script>
<script src='web-example.js'></script>

<div class="tavern-chat" 
	sender-name="<?=$senderName?>" 
	signature="<?=$signature?>" 
	domain="<?=$domain?>" 
	master="<?=$masterLogin?>">
	<ul class="tavern-chat__content">
		<button class='tavern-chat_button-load-old-content'>Load more</button>
	</ul>
	<div class="tavern-chat__control-panel">
		<div class="tavern-chat__control-panel-content-wrapper">
			<textarea class="tavern-chat__message-input" placeholder="Type message..."></textarea>
			<button class="tavern-chat__button tavern-chat__button-send">SEND</button>
			<button class="tavern-chat__button tavern-chat__button-exit">EXIT</button>
		</div>
	</div>
</div>
<?php else: ?>
<form class="name-request" action="msi.php" method="POST">
	<p>Welcom to "msi" chat!</p>
	<label for="msi_sender_name">Enter your name:</label>
	<input type="text" class="name-request__input-name" name="msi_sender_name">
	<input type="submit" class="name-request__submit-button">
</form>

<?php endif ?>